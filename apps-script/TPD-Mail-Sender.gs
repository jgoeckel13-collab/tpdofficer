/**
 * Tisbury PD - automatic email sender for the kiosk and officer apps (GitHub version).
 *
 * Runs in Google's cloud under the Gmail account you create it in. Every email is sent
 * FROM that Gmail account. Setup steps are in SETUP-EMAIL.md.
 *
 * ---- 1. EDIT THESE SETTINGS ----------------------------------------------------------
 */
const SETTINGS = {
  // A long random password. Put the SAME value in each app: Staff setup > Email sending > Key.
  KEY: 'CHANGE-ME-to-a-long-random-password',

  // Name shown next to the Gmail address.
  SENDER_NAME: 'TPD Kiosk',

  // Who the "Print / Sent to officer" email may go to. Anything else is refused.
  // Full addresses, or a whole domain written as '@tisburyma.gov'.
  ALLOWED_OFFICERS: ['@tisburyma.gov'],

  // Copied on every officer email (leave '' for none). Set here, not in the app.
  CC: '',

  // Visitor "Want a copy?" emails: limits (per address per hour, and in total per day).
  COPY_LIMIT_PER_ADDRESS_PER_HOUR: 3,
  COPY_LIMIT_PER_DAY: 60,
};
/* ---- 2. Nothing below needs editing ------------------------------------------------- */

const NO_REPLY = 'no-reply@no-reply.invalid'; // ".invalid" never exists, so replies bounce at once

function doPost(e) {
  try {
    const b = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    if (!SETTINGS.KEY || SETTINGS.KEY.indexOf('CHANGE-ME') === 0) return out_({ error: 'The mail sender is not set up yet (KEY not changed).' });
    if (String(b.key || '') !== SETTINGS.KEY) return out_({ error: 'Wrong key. Check Staff setup > Email sending.' });
    const files = pdfs_(b.pdfs);

    if (b.kind === 'test') {
      const to = clean_(b.to && b.to[0]);
      if (!isEmail_(to)) return out_({ error: 'Enter a valid address for the test.' });
      GmailApp.sendEmail(to, 'Test email from the Tisbury PD apps',
        'This is a test. If you can read it, automatic email is set up correctly.', { name: SETTINGS.SENDER_NAME });
      return out_({ ok: true });
    }

    if (!files.length) return out_({ error: 'No PDF attached' });

    if (b.kind === 'officer') {
      const to = (Array.isArray(b.to) ? b.to : []).map(clean_).filter(isEmail_);
      if (!to.length) return out_({ error: 'The selected officer(s) have no email address.' });
      const bad = to.filter(x => !allowed_(x));
      if (bad.length) return out_({ error: 'Not an allowed officer address: ' + bad.join(', ') + ' (add it to ALLOWED_OFFICERS in the script).' });
      if (!count_('day-officer', 300, 86400)) return out_({ error: 'Daily email limit reached.' });
      const opts = { name: SETTINGS.SENDER_NAME, attachments: files };
      if (SETTINGS.CC) opts.cc = SETTINGS.CC;
      GmailApp.sendEmail(to.join(','), line_(b.subject, 'Completed form'), String(b.text || '').slice(0, 4000), opts);
      return out_({ ok: true });
    }

    if (b.kind === 'self') {
      const to = clean_(b.self);
      if (!isEmail_(to)) return out_({ error: 'Enter a valid email address.' });
      if (!count_('addr-' + to.toLowerCase(), SETTINGS.COPY_LIMIT_PER_ADDRESS_PER_HOUR, 3600) ||
          !count_('day-self', SETTINGS.COPY_LIMIT_PER_DAY, 86400)) return out_({ error: 'Too many emails. Ask at the front desk.' });
      const pt = b.lang === 'pt', form = line_(b.name, pt ? 'formulário' : 'form').slice(0, 120);
      const subject = (pt ? 'Sua cópia: ' : 'Your copy: ') + form + ' - Tisbury Police';
      const body = pt
        ? 'Em anexo está a cópia do formulário que você preencheu no Departamento de Polícia de Tisbury.\n\nEsta é uma mensagem automática. Respostas a este e-mail não são recebidas. Para falar com o departamento, ligue ou visite a recepção.\n'
        : 'Attached is a copy of the form you completed at the Tisbury Police Department.\n\nThis is an automated message. Replies to this email are not received. To contact the department, call or visit the front desk.\n';
      GmailApp.sendEmail(to, subject, body, { name: SETTINGS.SENDER_NAME, attachments: files, replyTo: NO_REPLY });
      return out_({ ok: true });
    }
    return out_({ error: 'Unknown request' });
  } catch (x) {
    return out_({ error: 'The email could not be sent: ' + String(x && x.message || x).slice(0, 200) });
  }
}

function doGet() { return out_({ ok: true, service: 'Tisbury PD mail sender' }); }

function out_(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }
function clean_(s) { return String(s || '').trim(); }
function line_(s, d) { return (String(s || '').replace(/[\r\n<>]+/g, ' ').trim() || d).slice(0, 200); }
function isEmail_(s) { return s.length <= 200 && /^[^\s@,;<>]+@[^\s@,;<>]+\.[^\s@,;<>]{2,}$/.test(s); }
function allowed_(addr) {
  const a = addr.toLowerCase();
  return SETTINGS.ALLOWED_OFFICERS.some(x => { x = String(x).toLowerCase().trim(); return x.charAt(0) === '@' ? a.endsWith(x) : a === x; });
}
function pdfs_(list) {
  return (Array.isArray(list) ? list : []).slice(0, 3).map(f => {
    const bytes = Utilities.base64Decode(String(f && f.pdf || ''));
    if (bytes.length < 9 || String.fromCharCode(bytes[0], bytes[1], bytes[2], bytes[3], bytes[4]) !== '%PDF-' || bytes.length > 15e6) throw new Error('Invalid PDF');
    const name = String(f.filename || 'form.pdf').replace(/[\\/\u0000-\u001f]/g, '').slice(0, 120) || 'form.pdf';
    return Utilities.newBlob(bytes, 'application/pdf', /\.pdf$/i.test(name) ? name : name + '.pdf');
  });
}
function count_(key, max, seconds) {
  const lock = LockService.getScriptLock(); lock.waitLock(10000);
  try {
    const c = CacheService.getScriptCache(), n = +(c.get(key) || 0);
    if (n >= max) return false;
    c.put(key, String(n + 1), seconds); return true;
  } finally { lock.releaseLock(); }
}
