/** Google Voice email -> announcements. Paste into a standalone Apps Script project. */
const CONFIG = Object.freeze({
  lookbackDays: 7,
  maxThreads: 300,
  pageSize: 50,
  maxTextBytes: 12000
});

function extractVoiceText(body) {
  const lines = String(body).replace(/\r\n?/g, '\n').split('\n');
  const start = lines.reduce((matches, line, index) =>
    /^<https:\/\/voice\.google\.com\/?\s*>$/.test(line) ? matches.concat(index) : matches, []);
  const end = lines.reduce((matches, line, index) =>
    /^To respond to this text message, reply to this email or visit Google Voice\.$/.test(line)
      ? matches.concat(index) : matches, []);
  if (start.length !== 1 || end.length !== 1 || start[0] !== 0 || end[0] <= 1) {
    throw new Error('Voice body format missing or ambiguous');
  }
  const text = lines.slice(1, end[0]).join('\n');
  if (!text.trim() || lines.slice(1, end[0]).some(line => /^<https:\/\/voice\.google\.com\/?\s*>$/.test(line))) {
    throw new Error('Voice body format missing or ambiguous');
  }
  if (Utilities.newBlob(text).getBytes().length > CONFIG.maxTextBytes) {
    throw new Error('Voice text exceeds size limit');
  }
  return text;
}

function readHeaders(raw) {
  const source = String(raw);
  const boundary = /\r?\n\r?\n/.exec(source);
  if (!boundary) throw new Error('Missing header boundary');
  const head = source.slice(0, boundary.index).replace(/\r\n/g, '\n');
  const headers = {};
  let current = '';
  head.split('\n').forEach(line => {
    if (/^[ \t]/.test(line) && current) {
      headers[current][headers[current].length - 1] += ' ' + line.trim();
    } else {
      const match = /^([A-Za-z0-9-]+):\s*(.*)$/.exec(line);
      current = match ? match[1].toLowerCase() : '';
      if (match) (headers[current] || (headers[current] = [])).push(match[2]);
    }
  });
  return headers;
}

function singleHeader(headers, name) {
  const values = headers[name] || [];
  if (values.length !== 1) throw new Error('Missing or ambiguous ' + name + ' header');
  return values[0];
}

function addressOf(value) {
  const match = /(?:^|<)([A-Z0-9._%+-]+@[A-Z0-9.-]+)(?:>|$)/i.exec(value);
  if (!match || (value.match(/@/g) || []).length !== 1) throw new Error('Ambiguous address header');
  return match[1].toLowerCase();
}

/** This is an operational allowlist, not proof of the original SMS caller ID. */
function verifySender(raw, properties) {
  const headers = readHeaders(raw);
  const from = addressOf(singleHeader(headers, 'from'));
  const returnPath = addressOf(singleHeader(headers, 'return-path'));
  const approvedFrom = (properties.APPROVED_FROM_ADDRESS || '').toLowerCase();
  const approvedReturnPath = (properties.APPROVED_RETURN_PATH_ADDRESS || '').toLowerCase();
  const dkimDomain = (properties.APPROVED_DKIM_DOMAIN || '').toLowerCase();
  const dmarcDomain = (properties.APPROVED_DMARC_DOMAIN || '').toLowerCase();
  if (!approvedFrom || !approvedReturnPath || !dkimDomain || !dmarcDomain ||
      from !== approvedFrom || returnPath !== approvedReturnPath) return false;
  const results = singleHeader(headers, 'authentication-results').toLowerCase();
  // Require Gmail's receiving verifier plus passing, aligned authentication.
  // Inspect genuine samples before setting these properties. Never infer them.
  if (!/^mx\.google\.com\s*;/.test(results)) return false;
  const dkim = /\bdkim=pass\b[^;]*\bheader\.(?:d|i)=@?([a-z0-9.-]+)/.exec(results);
  const dmarc = /\bdmarc=pass\b[^;]*\bheader\.from=([a-z0-9.-]+)/.exec(results);
  return Boolean(dkim && dmarc && dkim[1] === dkimDomain && dmarc[1] === dmarcDomain);
}

function pruneDone(properties) {
  const cutoff = Date.now() - 8 * 24 * 60 * 60 * 1000;
  const all = properties.getProperties();
  Object.keys(all).forEach(key => {
    if (key.indexOf('DONE_') === 0 && Number(all[key]) < cutoff) properties.deleteProperty(key);
  });
}

function processAnnouncements() {
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(1000)) return;
  try {
    const store = PropertiesService.getScriptProperties();
    const properties = store.getProperties();
    const dryRun = properties.DRY_RUN !== 'false';
    const enabled = properties.PUBLISH_ENABLED === 'true';
    const endpoint = properties.ANNOUNCEMENTS_API_URL;
    const secret = properties.ANNOUNCEMENTS_WRITER_SECRET;
    if (enabled && !dryRun && (!endpoint || !/^https:\/\//.test(endpoint) || !secret)) {
      throw new Error('Publishing configuration incomplete');
    }
    if (enabled && !dryRun && !/^\d{13}$/.test(properties.START_AFTER_MS || '')) {
      throw new Error('START_AFTER_MS required for publishing');
    }
    pruneDone(store);
    let inspected = 0, eligible = 0, rejected = 0, failed = 0, published = 0;
    for (let offset = 0; offset < CONFIG.maxThreads; offset += CONFIG.pageSize) {
      const threads = GmailApp.search('newer_than:' + CONFIG.lookbackDays + 'd', offset, CONFIG.pageSize);
      if (!threads.length) break;
      for (const thread of threads) {
        for (const message of thread.getMessages()) {
          const id = message.getId();
          if (store.getProperty('DONE_' + id)) continue;
          const messageTime = message.getDate().getTime();
          if (messageTime < Date.now() - CONFIG.lookbackDays * 24 * 60 * 60 * 1000) continue;
          if (properties.START_AFTER_MS && messageTime <= Number(properties.START_AFTER_MS)) continue;
          inspected++;
          try {
            const raw = message.getRawContent();
            let verified = false;
            try { verified = verifySender(raw, properties); } catch (_) { /* fail closed */ }
            if (!verified) { rejected++; continue; }
            const text = extractVoiceText(message.getPlainBody());
            eligible++;
            if (dryRun || !enabled) continue;
            const result = UrlFetchApp.fetch(endpoint.replace(/\/$/, '') + '/announcements', {
              method: 'post',
              contentType: 'application/json; charset=utf-8',
              headers: { 'X-Announcements-Key': secret },
              payload: JSON.stringify({ gmailMessageId: id, text: text }),
              muteHttpExceptions: true
            });
            const status = result.getResponseCode();
            if (status !== 200 && status !== 201) {
              console.warn('Announcement POST failed id=' + id + ' status=' + status);
              throw new Error('POST failed');
            }
            store.setProperty('DONE_' + id, String(Date.now()));
            published++;
          } catch (error) {
            failed++;
            // No body, secret, response body, or raw headers in normal logs.
            console.warn('Announcement message failed id=' + id + ' type=' + error.name);
          }
        }
      }
      if (threads.length < CONFIG.pageSize) break;
    }
    console.log(JSON.stringify({ dryRun, enabled, inspected, eligible, rejected, failed, published }));
  } finally {
    lock.releaseLock();
  }
}

/** Logs selected header metadata for a Gmail message ID; never logs message text. */
function inspectVoiceSample(messageId) {
  const message = GmailApp.getMessageById(messageId);
  if (!message) throw new Error('Message not found');
  const headers = readHeaders(message.getRawContent());
  console.log(JSON.stringify({
    id: messageId,
    from: headers.from || [],
    returnPath: headers['return-path'] || [],
    authenticationResults: headers['authentication-results'] || [],
    date: message.getDate().toISOString()
  }));
}

function inspectConfiguredVoiceSample() {
  const id = PropertiesService.getScriptProperties().getProperty('SAMPLE_MESSAGE_ID');
  if (!id) throw new Error('Set SAMPLE_MESSAGE_ID in Script Properties first');
  inspectVoiceSample(id);
}

function listRecentSampleIds() {
  const threads = GmailApp.search('newer_than:7d', 0, 50);
  threads.forEach(thread => thread.getMessages().forEach(message => {
    console.log(JSON.stringify({ id: message.getId(), from: message.getFrom(), date: message.getDate().toISOString() }));
  }));
}
