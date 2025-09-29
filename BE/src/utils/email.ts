// email.service.ts — phiên bản Gmail REST API (không dùng Nodemailer/SMTP)
// Ưu điểm: nhẹ, ít RAM, ít socket, ít state → phù hợp Railway RAM thấp.

import { google } from 'googleapis';

const {
  EMAIL_USER,
  GMAIL_CLIENT_ID,
  GMAIL_CLIENT_SECRET,
  GMAIL_REFRESH_TOKEN,
  SERVER_URL,
  NODE_ENV,
} = process.env;

/** ----------------- OAuth2 client ----------------- */
const oauth2Client = new google.auth.OAuth2(
  GMAIL_CLIENT_ID,
  GMAIL_CLIENT_SECRET,
  // Dùng Playground để test; production nên dùng redirect URI của app bạn
  'https://developers.google.com/oauthplayground'
);
oauth2Client.setCredentials({ refresh_token: GMAIL_REFRESH_TOKEN });

// Gmail client (REST)
const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

/** ----------------- Utils ----------------- */
function assertEnv() {
  const missing = [
    ['EMAIL_USER', EMAIL_USER],
    ['GMAIL_CLIENT_ID', GMAIL_CLIENT_ID],
    ['GMAIL_CLIENT_SECRET', GMAIL_CLIENT_SECRET],
    ['GMAIL_REFRESH_TOKEN', GMAIL_REFRESH_TOKEN],
  ].filter(([, v]) => !v).map(([k]) => k);
  if (missing.length) throw new Error(`Thiếu biến môi trường: ${missing.join(', ')}`);
}

function nowVN(): string {
  return new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });
}

function makeAddress(display = 'Your App'): string {
  // Gmail yêu cầu "from" khớp đúng account đã uỷ quyền (EMAIL_USER)
  return `"${display}" <${EMAIL_USER}>`;
}

/**
 * Tạo MIME message (RFC 2822) dạng HTML và encode base64url cho Gmail API.
 * Không load template nặng để tiết kiệm RAM.
 */
function buildHtmlMessage({ to, subject, html, from }: { to: string; subject: string; html: string; from: string; }): string {
  const mime =
    `Content-Type: text/html; charset="UTF-8"\r\n` +
    `MIME-Version: 1.0\r\n` +
    `Content-Transfer-Encoding: base64\r\n` + // nội dung là HTML, không cần boundary
    `to: ${to}\r\n` +
    `from: ${from}\r\n` +
    `subject: ${subject}\r\n\r\n` +
    `${html}`;

  // Gmail yêu cầu base64 "URL-safe"
  // Node 18+: Buffer supports 'base64url'
  return Buffer.from(mime).toString('base64url');
}

/** ----------------- Concurrency guard rất nhẹ ----------------- */
let inflight = 0;
const MAX_CONCURRENT_SENDS = 2; // Giữ thấp để an toàn RAM trên Railway
async function withMailSlot<T>(fn: () => Promise<T>): Promise<T> {
  while (inflight >= MAX_CONCURRENT_SENDS) {
    await new Promise((r) => setTimeout(r, 25));
  }
  inflight++;
  try {
    return await fn();
  } finally {
    inflight--;
  }
}

/** ----------------- Public APIs ----------------- */
export async function sendOtpEmail(to: string, otp: string) {
  assertEnv();
  if (!otp) throw new Error('Thiếu OTP');

  const from = makeAddress('Your App');
  const subject = 'Mã OTP của bạn';
  const html =
    `<p>Mã OTP của bạn: <b>${otp}</b>.</p>` +
    `<p>Mã sẽ hết hạn sau 10 phút.</p>`;

  const raw = buildHtmlMessage({ to, subject, html, from });

  const res = await withMailSlot(() =>
    gmail.users.messages.send({
      userId: 'me',
      requestBody: { raw },
    })
  );

  const id = res.data.id || 'unknown';
  if (NODE_ENV !== 'production') {
    console.log('✅ OTP sent', { id, to });
  } else {
    console.log('✅ OTP sent', { id });
  }
  return { messageId: id };
}

export async function sendPasswordChangeNotification(to: string, name: string, rollbackToken: string) {
  assertEnv();
  if (!SERVER_URL) throw new Error('Thiếu SERVER_URL');

  const from = makeAddress('Security');
  const subject = 'Đổi mật khẩu thành công';
  const rollbackUrl = `${SERVER_URL}/auth/rollback-password?token=${encodeURIComponent(rollbackToken)}`;
  const html = `
    <h2>Đổi mật khẩu</h2>
    <p>Xin chào ${name},</p>
    <p>Mật khẩu của bạn đã được đổi lúc ${nowVN()}.</p>
    <p><strong>Nếu không phải bạn thực hiện</strong>, nhấn vào liên kết bên dưới để khôi phục mật khẩu trước đó:</p>
    <p>
      <a href="${rollbackUrl}" style="background-color:#ff4444;color:#fff;padding:10px 16px;text-decoration:none;border-radius:6px;display:inline-block">
        Khôi phục mật khẩu trước đó
      </a>
    </p>
    <p>Liên kết hết hạn sau 24 giờ.</p>
    <br/>
    <p>Trân trọng,<br/>Đội ngũ Bảo mật</p>
  `;

  const raw = buildHtmlMessage({ to, subject, html, from });

  const res = await withMailSlot(() =>
    gmail.users.messages.send({
      userId: 'me',
      requestBody: { raw },
    })
  );

  const id = res.data.id || 'unknown';
  if (NODE_ENV !== 'production') {
    console.log('✅ Password notice sent', { id, to });
  } else {
    console.log('✅ Password notice sent', { id });
  }
  return { messageId: id };
}

/** ----------------- Gợi ý chạy Production nhẹ RAM -----------------
 *  1) Không chạy bằng ts-node ở prod:
 *     - build:  tsc
 *     - run:    node dist/index.js
 *  2) Giữ concurrency thấp (MAX_CONCURRENT_SENDS=1..2).
 *  3) Log gọn (đã làm sẵn).
 *  4) Tránh load template/attachments nặng vào bộ nhớ.
 *  5) Với HTML phức tạp → render sớm ra chuỗi ngắn gọn, không import thư viện to.
 *  6) OAuth2:
 *     - Refresh token mint với access_type=offline & prompt=consent
 *     - Scope: https://mail.google.com/ (hoặc gmail.send)
 *     - "from" phải trùng EMAIL_USER
 * ----------------------------------------------------------------- */
