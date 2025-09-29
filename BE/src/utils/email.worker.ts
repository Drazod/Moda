import { google } from 'googleapis';

// Hardened worker: validates env, emits structured errors and never throws unformatted text

interface Payload {
  to: string; subject: string; html: string; fromName?: string;
}

function fail(message: string, details?: any) {
  const body = JSON.stringify({ ok: false, error: message, details }, null, 2);
  process.stderr.write(body + '\n');
  process.exit(1);
}

const {
  EMAIL_USER,
  GMAIL_CLIENT_ID,
  GMAIL_CLIENT_SECRET,
  GMAIL_REFRESH_TOKEN,
} = process.env;

function buildHtmlMessage({ to, subject, html, from }: {to:string;subject:string;html:string;from:string;}): string {
  const mime =
    `Content-Type: text/html; charset="UTF-8"\r\n` +
    `MIME-Version: 1.0\r\n` +
    `Content-Transfer-Encoding: base64\r\n` +
    `to: ${to}\r\n` +
    `from: ${from}\r\n` +
    `subject: ${subject}\r\n\r\n` +
    `${html}`;
  return Buffer.from(mime).toString('base64url');
}

(async () => {
  try {
    // Basic env validation
    const missing: string[] = [];
    if (!EMAIL_USER) missing.push('EMAIL_USER');
    if (!GMAIL_CLIENT_ID) missing.push('GMAIL_CLIENT_ID');
    if (!GMAIL_CLIENT_SECRET) missing.push('GMAIL_CLIENT_SECRET');
    if (!GMAIL_REFRESH_TOKEN) missing.push('GMAIL_REFRESH_TOKEN');
    if (missing.length) return fail('Missing required env vars', { missing });

    let payload: Payload;
    try {
      payload = JSON.parse(process.argv[2] || '{}');
    } catch (e) {
      return fail('Invalid JSON payload argument', { arg: process.argv[2] });
    }
    if (!payload.to || !payload.subject || !payload.html) {
      return fail('Invalid payload fields', { required: ['to', 'subject', 'html'], got: payload });
    }

    const from = `"${payload.fromName || 'Your App'}" <${EMAIL_USER}>`;

    const oauth2Client = new google.auth.OAuth2(
      GMAIL_CLIENT_ID,
      GMAIL_CLIENT_SECRET,
      'https://developers.google.com/oauthplayground'
    );
    oauth2Client.setCredentials({ refresh_token: GMAIL_REFRESH_TOKEN });

    let accessToken: string | undefined;
    try {
      const tokenResp = await oauth2Client.getAccessToken();
      accessToken = tokenResp?.token || undefined;
      if (!accessToken) return fail('Failed to obtain access token');
    } catch (e: any) {
      return fail('OAuth2 access token error', { message: e?.message });
    }

    const gmail = google.gmail({ version: 'v1', auth: oauth2Client });
    const raw = buildHtmlMessage({ to: payload.to, subject: payload.subject, html: payload.html, from });
    const res = await gmail.users.messages.send({ userId: 'me', requestBody: { raw } });
    process.stdout.write(JSON.stringify({ ok: true, id: res.data.id }) + '\n');
    process.exit(0);
  } catch (e: any) {
    fail('Unhandled worker exception', { message: e?.message, stack: e?.stack });
  }
})();

process.on('unhandledRejection', (r: any) => {
  fail('Unhandled promise rejection', { reason: r });
});
process.on('uncaughtException', (err: any) => {
  fail('Uncaught exception', { message: err?.message, stack: err?.stack });
});
