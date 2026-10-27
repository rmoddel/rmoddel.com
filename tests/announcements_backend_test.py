import importlib.util
import json
import pathlib
import threading
import unittest
from concurrent.futures import ThreadPoolExecutor

PATH = pathlib.Path(__file__).parents[1] / "infra/announcements/src/handler.py"
spec = importlib.util.spec_from_file_location("announcements_handler", PATH)
handler = importlib.util.module_from_spec(spec)
spec.loader.exec_module(handler)


class ConditionalCheckFailedException(Exception):
    pass


class MemoryTable:
    def __init__(self):
        self.items = {}
        self.lock = threading.Lock()

    def put_item(self, Item, ConditionExpression):
        assert ConditionExpression == "attribute_not_exists(id)"
        with self.lock:
            if Item["id"] in self.items:
                raise ConditionalCheckFailedException()
            self.items[Item["id"]] = Item

    def query(self, **kwargs):
        assert kwargs["IndexName"] == "ByPublishedAt"
        assert kwargs["ScanIndexForward"] is False
        rows = sorted(self.items.values(), key=lambda x: x["publishedAt"], reverse=True)
        return {"Items": rows}


class BackendTests(unittest.TestCase):
    def setUp(self):
        self.db = MemoryTable()
        handler._table = self.db
        handler.writer_secret = lambda: "s" * 48

    def call(self, method, body=None, secret=None, query=None):
        event = {"requestContext": {"http": {"method": method}}}
        if body is not None:
            event["body"] = json.dumps(body, ensure_ascii=False)
        if secret is not None:
            event["headers"] = {"X-Announcements-Key": secret}
        if query is not None:
            event["queryStringParameters"] = query
        return handler.lambda_handler(event, None)

    def test_unicode_multiline_and_idempotent_retry(self):
        body = {"gmailMessageId": "18ABCDEF01234567", "text": "שלום\nSecond line"}
        self.assertEqual(self.call("POST", body, "s" * 48)["statusCode"], 201)
        self.assertEqual(self.call("POST", body, "s" * 48)["statusCode"], 200)
        self.assertEqual(len(self.db.items), 1)
        result = json.loads(self.call("GET")["body"])
        self.assertEqual(result["items"][0]["text"], body["text"])

    def test_rejects_bad_credentials_and_input(self):
        body = {"gmailMessageId": "18ABCDEF01234567", "text": "Hello"}
        self.assertEqual(self.call("POST", body, "wrong")["statusCode"], 401)
        self.assertEqual(self.call("POST", {**body, "text": " "}, "s" * 48)["statusCode"], 400)
        self.assertEqual(self.call("POST", {**body, "text": "x" * 12001}, "s" * 48)["statusCode"], 400)
        self.assertEqual(self.call("GET", query={"cursor": "bad"})["statusCode"], 400)
        self.assertFalse(self.db.items)

    def test_concurrent_retry_has_one_created_item(self):
        body = {"gmailMessageId": "18ABCDEF01234567", "text": "One"}
        with ThreadPoolExecutor(max_workers=8) as pool:
            statuses = list(pool.map(lambda _: self.call("POST", body, "s" * 48)["statusCode"], range(20)))
        self.assertEqual(statuses.count(201), 1)
        self.assertEqual(statuses.count(200), 19)
        self.assertEqual(len(self.db.items), 1)


if __name__ == "__main__":
    unittest.main()
