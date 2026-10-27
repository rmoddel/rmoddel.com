# Announcements setup

The site page is `/announcements`, with a Basic Auth protected entry at `/auth/announcements` linked from `/auth`. Both read the public, read-only API. Writing requires a separate secret held only by AWS Secrets Manager and Google Apps Script. No AWS resources have been deployed by this repository change.

## 1. Deploy the AWS stack

1. Choose the AWS account and Region used for this site. Install and configure AWS CLI and SAM CLI with deploy permissions.
2. Create a Secrets Manager **plain string** secret using the console, named `rmoddel-announcements-writer`. Generate at least 32 random bytes (or 48 random alphanumeric characters). Record its ARN. Keep the value out of shell history, files in this repository, Amplify variables, and browser code.
3. From the repository root, run:

   ```sh
   sam build --template-file infra/announcements/template.yaml
   sam deploy --guided --stack-name rmoddel-announcements --capabilities CAPABILITY_IAM --parameter-overrides SiteOrigin=https://rmoddel.com WriterSecretArn=YOUR_SECRET_ARN
   ```

   Use `https://rmoddel.com` as the production browser origin. The template allows only that exact origin. If the page is used from another real origin, add it explicitly to `AllowOrigins` before deploying. Do not use `*`. CORS is a browser restriction; the writer key is what protects POST.
4. Save the `ApiUrl` and `TableName` stack outputs. Test `GET ApiUrl/announcements`; it should return `{"items":[],"nextCursor":null}`. A POST with a wrong key should return 401. Do not include the real key in command lines that enter shell history.
5. In Amplify, set `NEXT_PUBLIC_ANNOUNCEMENTS_API_URL` to `ApiUrl` and rebuild the site. This URL is public, not a secret. Do not add the writer key to Amplify or to any `NEXT_PUBLIC_` variable. Visit `/announcements` and confirm the empty state. The page refreshes every minute and offers pagination for older entries.

The Lambda uses DynamoDB conditional `PutItem` keyed by the Gmail message ID. This prevents duplicate records even when two executions race. The feed index can take a short time to reflect a new or removed record.

## 2. Inspect actual Voice mail before enabling publication

The provided test body proves the extraction boundary only. It contains no raw headers and does **not** verify the SMS sender. A visible sender, subject, or `txt.voice.google.com` address alone is not proof of the original SMS sender. Google may authenticate its forwarded mail while the original phone identity remains a separate claim.

1. In the same Google account that receives the forwarded Voice email, send several new texts from your **own phone**. Include one multiline message and Hebrew text. Send several from a deliberately **unapproved phone** as negative controls. If possible, include two messages that Gmail groups into one thread.
2. Open each email in Gmail → **Show original**. Record the exact `From` mailbox, exact `Return-Path` mailbox, `Authentication-Results`, DKIM signing domain, DMARC `header.from` domain, and whether Gmail reports authentication as passing. Do this for every message separately. Keep samples private because headers contain addresses and routing data. The RFC `Message-ID` shown in the raw headers is **not** the Gmail internal ID used by this feature.
3. In Apps Script, run `listRecentSampleIds` to see recent Gmail internal IDs, senders, and dates without bodies. Set `SAMPLE_MESSAGE_ID` to one of those IDs and run `inspectConfiguredVoiceSample`. Compare its logged headers with Gmail Show original. Repeat for approved and unapproved examples. These diagnostics log selected header metadata but no message body or secret; review the private execution log carefully.
4. Require an exact `From` **and** `Return-Path` that are stable across your approved samples, differ from unapproved samples, and have a single Gmail `Authentication-Results` header showing passing DKIM and DMARC for the expected domains. Populate the four allowlist properties below only from those observations. Run dry run against both sets. A negative control must be rejected. If these conditions cannot be established, keep `PUBLISH_ENABLED=false` and use manual review instead. Even a passing check is an operational allowlist, **not cryptographic proof of the original SMS caller ID**; phone number spoofing and changes to Google's mail format remain possible. Do not use this as a high assurance authorization channel.

## 3. Install and authorize Apps Script

1. Create a standalone project at [Apps Script](https://script.google.com/) while signed into the receiving Google account. Paste the full content of `scripts/announcements.gs` into `Code.gs`.
2. Open Project Settings → **Script properties** and set:

   | Property | Value |
   | --- | --- |
   | `ANNOUNCEMENTS_API_URL` | The stack `ApiUrl`, without `/announcements` |
   | `ANNOUNCEMENTS_WRITER_SECRET` | The Secrets Manager plain string value |
   | `DRY_RUN` | `true` |
   | `PUBLISH_ENABLED` | `false` |
   | `APPROVED_FROM_ADDRESS` | Exact vetted mailbox, when established |
   | `APPROVED_RETURN_PATH_ADDRESS` | Exact vetted mailbox, when established |
   | `APPROVED_DKIM_DOMAIN` | Exact vetted signing domain, when established |
   | `APPROVED_DMARC_DOMAIN` | Exact vetted DMARC `header.from` domain, when established |
   | `START_AFTER_MS` | Unix epoch milliseconds at the moment you begin the live test |

   Script Properties are private to project editors; restrict project access. Never paste the key into code, logs, screenshots, chat, or a public sheet. The code defaults to dry run and disabled publication if those switches are missing.
3. Select `processAnnouncements` and click **Run** once. Grant Gmail read, external request, and Script Properties permissions in the Google authorization prompt. Review the execution summary counts. Normal runs log counts and failed message IDs/error classes only, never bodies or keys.
4. In Apps Script, open **Triggers** → **Add Trigger** → choose `processAnnouncements`, event source **Time-driven**, minute timer **Every 5 minutes**. Keep dry run on while verifying. Each run checks recent individual Gmail messages, including messages in the same thread. Successful IDs are remembered in Script Properties; the backend is the final duplicate guard. Failed posts are not marked done and are retried on later runs within the seven-day lookback.
5. After the negative control and all header checks pass, set `START_AFTER_MS` to the current epoch milliseconds, then set `DRY_RUN=false` and `PUBLISH_ENABLED=true`. Send one new own-phone message and watch the page. Scheduled polling plus the page's one-minute refresh means publication can take a few minutes.

## 4. Safe end-to-end checks

1. **Own phone:** Send a new Voice SMS after `START_AFTER_MS`, run the script manually or await its trigger, and confirm exactly one new page entry. The message should contain only text between the first Voice URL and the response footer.
2. **Unapproved sender:** Send a text from the unapproved phone and confirm the rejected count rises, no POST succeeds, and no entry appears. If it appears, set `PUBLISH_ENABLED=false` immediately and remove it as described below.
3. **Duplicate and thread:** Run the trigger again and confirm no second item. Send a second approved message in the same Gmail thread and confirm it gets its own entry. To test the server guard independently, submit the same Gmail ID twice with an authorized test client: first response 201, second 200 with `status=duplicate`.
4. **Multiline and Hebrew:** Confirm original line breaks and Hebrew characters display correctly and no HTML is interpreted.
5. **Retry:** Temporarily set `ANNOUNCEMENTS_API_URL` to an invalid HTTPS URL in a test run. Confirm the message is not recorded as done. Restore the URL and rerun; it should publish once. Do this only with a fresh approved test message. Avoid exposing the key in client logs or command history.

## 5. Troubleshooting, stopping, and removal

- **No items:** Check the Amplify URL variable and redeploy the site, then inspect browser network requests, API status, Lambda CloudWatch logs, and Apps Script execution counts. CORS must list the exact page origin. The DynamoDB feed index is eventually consistent.
- **All messages rejected:** Compare raw headers from genuine samples. Do not loosen the sender gate based on the displayed name or subject. Missing or multiple expected headers fail closed. Google can change its mail format or authentication headers.
- **Posts fail:** Verify API URL, Script Properties key against Secrets Manager, Lambda access to the secret/table, message size, and response status. The script intentionally does not log response bodies.
- **Pause immediately:** Set `PUBLISH_ENABLED=false`, then delete the `processAnnouncements` time-driven trigger in Apps Script → Triggers. Removing the trigger stops future scheduled checks; already published entries remain.
- **Remove an incorrect item while preserving its duplicate marker:** Get its Gmail message ID from the GET response or page network response and run the command below with the stack `TableName`. This removes the text and changes `feed`, so the item leaves the public index while its ID remains reserved. After index propagation, refresh the page.

  ```sh
  aws dynamodb update-item --table-name YOUR_TABLE_NAME --key '{"id":{"S":"GMAIL_MESSAGE_ID"}}' --update-expression 'SET #f = :removed REMOVE #t' --condition-expression 'attribute_exists(id)' --expression-attribute-names '{"#f":"feed","#t":"text"}' --expression-attribute-values '{":removed":{"S":"REMOVED"}}'
  ```

Do not delete the DynamoDB item outright: that would allow a delayed or repeated POST to recreate it. For a compromised writer key, disable the trigger, rotate the Secrets Manager value and Script Property, and investigate recent entries. Lambda instances cache the key for up to five minutes; disable the POST route or redeploy the stack if immediate revocation is required.
