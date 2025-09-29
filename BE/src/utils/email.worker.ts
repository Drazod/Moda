import { google } from 'googleapis';

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
    const payload = JSON.parse(process.argv[2] || '{}') as {
      to: string; subject: string; html: string; fromName?: string;
    };
    const from = `"${payload.fromName || 'Your App'}" <${EMAIL_USER}>`;

    const oauth2Client = new google.auth.OAuth2(
      GMAIL_CLIENT_ID,
      GMAIL_CLIENT_SECRET,
      'https://developers.google.com/oauthplayground'
    );
    oauth2Client.setCredentials({ refresh_token: GMAIL_REFRESH_TOKEN });

    const gmail = google.gmail({ version: 'v1', auth: oauth2Client });
    const raw = buildHtmlMessage({ to: payload.to, subject: payload.subject, html: payload.html, from });
    const res = await gmail.users.messages.send({ userId: 'me', requestBody: { raw } });
    process.stdout.write(JSON.stringify({ ok: true, id: res.data.id }) + '\n');
    process.exit(0);
  } catch (e:any) {
    process.stderr.write((e?.message || String(e)) + '\n');
    process.exit(1);
  }
})();
