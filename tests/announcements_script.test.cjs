const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const test = require('node:test');

const context = vm.createContext({
  Utilities: { newBlob: text => ({ getBytes: () => Buffer.from(text) }) },
  console
});
vm.runInContext(fs.readFileSync('scripts/announcements.gs', 'utf8'), context);

const body = '<https://voice.google.com>\nשלום\nSecond line\nTo respond to this text message, reply to this email or visit Google Voice.\nGoogle LLC';
const raw = 'From: "Allowed" <approved@example.com>\r\nReturn-Path: <bounce@google.com>\r\nAuthentication-Results: mx.google.com; dkim=pass header.d=google.com; dmarc=pass header.from=example.com\r\n\r\nbody';
const properties = {
  APPROVED_FROM_ADDRESS: 'approved@example.com',
  APPROVED_RETURN_PATH_ADDRESS: 'bounce@google.com',
  APPROVED_DKIM_DOMAIN: 'google.com',
  APPROVED_DMARC_DOMAIN: 'example.com'
};

test('extracts multiline Unicode and rejects ambiguous format', () => {
  assert.equal(context.extractVoiceText(body), 'שלום\nSecond line');
  assert.throws(() => context.extractVoiceText(body.replace('Google LLC', 'To respond to this text message, reply to this email or visit Google Voice.')));
  assert.throws(() => context.extractVoiceText('hello'));
});

test('requires matching sender and authentication headers', () => {
  assert.equal(context.verifySender(raw, properties), true);
  assert.equal(context.verifySender(raw.replace('approved@example.com', 'other@example.com'), properties), false);
  assert.equal(context.verifySender(raw.replace('dkim=pass', 'dkim=fail'), properties), false);
  assert.throws(() => context.verifySender(raw.replace('\r\n\r\nbody', '\r\nbody'), properties));
  assert.throws(() => context.verifySender(raw.replace('Authentication-Results:', 'Authentication-Results: mx.google.com; dkim=pass header.d=google.com; dmarc=pass header.from=example.com\r\nAuthentication-Results:'), properties));
});

test('processes messages separately, rejects unapproved sender, and retries failed POST', () => {
  const properties = {
    ...propertiesForRun(),
    DRY_RUN: 'false', PUBLISH_ENABLED: 'true',
    ANNOUNCEMENTS_API_URL: 'https://example.test', ANNOUNCEMENTS_WRITER_SECRET: 'secret'
  };
  const store = {
    getProperties: () => ({ ...properties }),
    getProperty: key => properties[key],
    setProperty: (key, value) => { properties[key] = value; },
    deleteProperty: key => { delete properties[key]; }
  };
  const allowed = { getId: () => '18abcdef01234567', getRawContent: () => raw, getPlainBody: () => body, getDate: () => new Date() };
  const blocked = { getId: () => '18abcdef01234568', getRawContent: () => raw.replace('approved@example.com', 'other@example.com'), getPlainBody: () => body, getDate: () => new Date() };
  let posts = 0;
  context.PropertiesService = { getScriptProperties: () => store };
  context.LockService = { getScriptLock: () => ({ tryLock: () => true, releaseLock: () => {} }) };
  context.GmailApp = { search: (_q, offset) => offset ? [] : [{ getMessages: () => [allowed, blocked] }] };
  context.UrlFetchApp = { fetch: () => ({ getResponseCode: () => ++posts === 1 ? 503 : 201 }) };
  context.processAnnouncements();
  assert.equal(posts, 1);
  assert.equal(properties.DONE_18abcdef01234567, undefined);
  context.processAnnouncements();
  assert.equal(posts, 2);
  assert.ok(properties.DONE_18abcdef01234567);
  context.processAnnouncements();
  assert.equal(posts, 2);
});

function propertiesForRun() {
  return {
    APPROVED_FROM_ADDRESS: 'approved@example.com',
    APPROVED_RETURN_PATH_ADDRESS: 'bounce@google.com',
    APPROVED_DKIM_DOMAIN: 'google.com',
    APPROVED_DMARC_DOMAIN: 'example.com',
    START_AFTER_MS: '1700000000000'
  };
}
