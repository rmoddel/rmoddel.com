"""Small public feed with a secret protected, idempotent writer."""

import base64
import binascii
import hmac
import json
import logging
import os
import re
import time
from datetime import datetime, timezone

LOG = logging.getLogger(__name__)
LOG.setLevel(logging.INFO)
ID_RE = re.compile(r"^[0-9a-fA-F]{8,64}$")
MAX_BODY_BYTES = 16_384
MAX_TEXT_BYTES = 12_000
PAGE_SIZE = 50
_table = None
_secret = None
_secret_expires = 0


def response(status, payload):
    return {
        "statusCode": status,
        "headers": {"content-type": "application/json; charset=utf-8", "cache-control": "no-store"},
        "body": json.dumps(payload, ensure_ascii=False),
    }


def table():
    global _table
    if _table is None:
        import boto3

        _table = boto3.resource("dynamodb").Table(os.environ["TABLE_NAME"])
    return _table


def writer_secret():
    global _secret, _secret_expires
    if _secret is not None and time.monotonic() < _secret_expires:
        return _secret
    import boto3

    value = boto3.client("secretsmanager").get_secret_value(
        SecretId=os.environ["WRITER_SECRET_ARN"]
    )["SecretString"]
    if len(value) < 32:
        raise ValueError("Writer key is too short")
    _secret = value
    _secret_expires = time.monotonic() + 300
    return value


def decode_cursor(value):
    if not isinstance(value, str) or len(value) > 1024:
        raise ValueError("Invalid cursor")
    try:
        key = json.loads(base64.urlsafe_b64decode(value + "=" * (-len(value) % 4)))
    except (ValueError, UnicodeError, binascii.Error) as error:
        raise ValueError("Invalid cursor") from error
    if not isinstance(key, dict) or set(key) != {"id", "feed", "publishedAt"}:
        raise ValueError("Invalid cursor")
    if not all(isinstance(key[name], str) for name in key):
        raise ValueError("Invalid cursor")
    if key["feed"] != "ANNOUNCEMENT" or not ID_RE.fullmatch(key["id"]):
        raise ValueError("Invalid cursor")
    if not re.fullmatch(r"\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d\.\d{6}\+00:00", key["publishedAt"]):
        raise ValueError("Invalid cursor")
    return key


def get_announcements(event):
    params = event.get("queryStringParameters") or {}
    if set(params) - {"cursor"}:
        return response(400, {"error": "Invalid query"})
    kwargs = {
        "IndexName": "ByPublishedAt",
        "KeyConditionExpression": "feed = :feed",
        "ExpressionAttributeValues": {":feed": "ANNOUNCEMENT"},
        "ScanIndexForward": False,
        "Limit": PAGE_SIZE,
    }
    if "cursor" in params:
        try:
            kwargs["ExclusiveStartKey"] = decode_cursor(params["cursor"])
        except ValueError:
            return response(400, {"error": "Invalid cursor"})
    result = table().query(**kwargs)
    items = [
        {"id": row["id"], "text": row["text"], "publishedAt": row["publishedAt"]}
        for row in result.get("Items", [])
    ]
    next_key = result.get("LastEvaluatedKey")
    cursor = (
        base64.urlsafe_b64encode(json.dumps(next_key).encode()).decode().rstrip("=")
        if next_key else None
    )
    return response(200, {"items": items, "nextCursor": cursor})


def post_announcement(event):
    headers = {key.lower(): value for key, value in (event.get("headers") or {}).items()}
    supplied = headers.get("x-announcements-key", "")
    if not supplied or not hmac.compare_digest(supplied, writer_secret()):
        LOG.warning("Rejected announcement write: invalid credential")
        return response(401, {"error": "Unauthorized"})

    raw = event.get("body") or ""
    if event.get("isBase64Encoded"):
        if not isinstance(raw, str) or len(raw) > 22_000:
            return response(413, {"error": "Body too large"})
        try:
            raw = base64.b64decode(raw, validate=True).decode("utf-8")
        except (ValueError, UnicodeError, binascii.Error):
            return response(400, {"error": "Invalid body"})
    try:
        body_size = len(raw.encode("utf-8")) if isinstance(raw, str) else MAX_BODY_BYTES + 1
    except UnicodeEncodeError:
        return response(400, {"error": "Invalid body"})
    if body_size > MAX_BODY_BYTES:
        return response(413, {"error": "Body too large"})
    try:
        payload = json.loads(raw)
    except (ValueError, TypeError):
        return response(400, {"error": "Invalid JSON"})
    if not isinstance(payload, dict) or set(payload) != {"gmailMessageId", "text"}:
        return response(400, {"error": "Expected gmailMessageId and text"})
    message_id, message = payload["gmailMessageId"], payload["text"]
    if not isinstance(message_id, str) or not ID_RE.fullmatch(message_id):
        return response(400, {"error": "Invalid Gmail message ID"})
    try:
        valid_text = (isinstance(message, str) and bool(message.strip()) and
                      len(message.encode("utf-8")) <= MAX_TEXT_BYTES and
                      not any(ord(char) < 32 and char not in "\r\n\t" for char in message))
    except UnicodeEncodeError:
        valid_text = False
    if not valid_text:
        return response(400, {"error": "Invalid text"})

    item = {
        "id": message_id.lower(),
        "feed": "ANNOUNCEMENT",
        "publishedAt": datetime.now(timezone.utc).isoformat(timespec="microseconds"),
        "text": message,
    }
    try:
        table().put_item(Item=item, ConditionExpression="attribute_not_exists(id)")
    except Exception as error:
        # The condition is atomic for retries and concurrent Lambda executions.
        if error.__class__.__name__ == "ConditionalCheckFailedException" or (
            getattr(error, "response", {}).get("Error", {}).get("Code")
            == "ConditionalCheckFailedException"
        ):
            return response(200, {"status": "duplicate", "id": item["id"]})
        raise
    LOG.info("Published announcement id=%s", item["id"])
    return response(201, {"status": "created", "id": item["id"]})


def lambda_handler(event, _context):
    method = (event.get("requestContext") or {}).get("http", {}).get("method")
    try:
        if method == "GET":
            return get_announcements(event)
        if method == "POST":
            return post_announcement(event)
        return response(405, {"error": "Method not allowed"})
    except Exception as error:
        LOG.error("Announcement request failed type=%s", type(error).__name__)
        return response(500, {"error": "Internal error"})
