import { google } from 'googleapis';
import nodemailer from 'nodemailer';
import SMTPPool from 'nodemailer/lib/smtp-pool';  


const {
  EMAIL_USER,
  GMAIL_CLIENT_ID,
  GMAIL_CLIENT_SECRET,
  GMAIL_REFRESH_TOKEN,
  SERVER_URL,
  NODE_ENV,
} = process.env;

// ----- OAuth2 client -----
const oauth2Client = new google.auth.OAuth2(
  GMAIL_CLIENT_ID,
  GMAIL_CLIENT_SECRET,
  // Playground dùng để test; prod nên dùng redirect URI của app bạn
  'https://developers.google.com/oauthplayground'
);
oauth2Client.setCredentials({ refresh_token: GMAIL_REFRESH_TOKEN });

// ----- Helpers -----
function assertEnv() {
  const missing = [
    ['EMAIL_USER', EMAIL_USER],
    ['GMAIL_CLIENT_ID', GMAIL_CLIENT_ID],
    ['GMAIL_CLIENT_SECRET', GMAIL_CLIENT_SECRET],
    ['GMAIL_REFRESH_TOKEN', GMAIL_REFRESH_TOKEN],
  ].filter(([, v]) => !v).map(([k]) => k);

  if (missing.length) {
    throw new Error(`Thiếu biến môi trường: ${missing.join(', ')}`);
  }
}

async function getAccessTokenString(): Promise<string> {
  const at = await oauth2Client.getAccessToken();
  const token = typeof at === 'string' ? at : at?.token;
  if (!token) throw new Error('Không lấy được OAuth2 access token');
  return token;
}

function fromHeader(display = 'Your App') {
  return `"${display}" <${EMAIL_USER}>`; // Gmail yêu cầu from phải khớp account
}

function nowVN() {
  return new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });
}

// ----- Singleton transporter với pool -----
let transporterPromise: Promise<nodemailer.Transporter> | null = null;
let lastTokenAt = 0;
const TOKEN_TTL_MS = 45 * 60 * 1000; // làm mới trước khi token 1h hết hạn

async function getTransporter(): Promise<nodemailer.Transporter> {
  assertEnv();
  const now = Date.now();
  const needNew = !transporterPromise || (now - lastTokenAt > TOKEN_TTL_MS);

  if (!needNew) return transporterPromise!;

  transporterPromise = (async () => {
    console.log('🔐 Lấy OAuth2 access token…');
    const accessToken = await getAccessTokenString();
    lastTokenAt = now;

    const transportOptions: SMTPPool.Options = {
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      pool: true,           // Giữ 1 connection ấm
      maxConnections: 1,
      maxMessages: 100,     // thỉnh thoảng recycle kết nối
      auth: {
        type: 'OAuth2',
        user: EMAIL_USER!,
        clientId: GMAIL_CLIENT_ID!,
        clientSecret: GMAIL_CLIENT_SECRET!,
        refreshToken: GMAIL_REFRESH_TOKEN!,
        accessToken,
      },
      // Tắt logger để tránh noise/heap ở prod
      logger: NODE_ENV !== 'production' ? false : false,
    };

    console.log('🚀 Tạo transporter (OAuth2)…');
    const transporter = nodemailer.createTransport(transportOptions);
    console.log('🧪 Verify SMTP…');
    await transporter.verify();
    console.log('✅ Transporter sẵn sàng');
    return transporter;
  })();

  return transporterPromise;
}

// Đóng pool khi app tắt (tốt cho Docker/Render)
function setupMailerShutdown() {
  const close = async () => {
    try {
      const t = await transporterPromise;
      if (t && 'close' in t) (t as any).close();
    } catch {}
  };
  process.on('SIGTERM', close);
  process.on('SIGINT', close);
}
setupMailerShutdown();

// ----- Public API: gửi OTP -----
export async function sendOtpEmail(to: string, otp: string) {
  console.log('📨 Gửi OTP…');
  if (!otp) throw new Error('Thiếu OTP');

  const transporter = await getTransporter();
  const mailOptions = {
    from: fromHeader('Your App'),
    to,
    subject: 'Mã OTP của bạn',
    text: `Mã OTP của bạn: ${otp}. Mã sẽ hết hạn sau 10 phút.`,
    html: `<p>Mã OTP của bạn: <b>${otp}</b>.</p><p>Mã sẽ hết hạn sau 10 phút.</p>`,
  };

  const info = await transporter.sendMail(mailOptions);
  console.log('✅ OTP sent', { id: info.messageId });
  return { messageId: info.messageId };
}

// ----- Public API: thông báo đổi mật khẩu -----
export async function sendPasswordChangeNotification(to: string, name: string, rollbackToken: string) {
  console.log('🔐 Gửi thông báo đổi mật khẩu…');
  if (!SERVER_URL) throw new Error('Thiếu SERVER_URL');

  const transporter = await getTransporter();
  const rollbackUrl = `${SERVER_URL}/auth/rollback-password?token=${encodeURIComponent(rollbackToken)}`;

  const mailOptions = {
    from: fromHeader('Security'),
    to,
    subject: 'Đổi mật khẩu thành công',
    html: `
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
    `,
  };

  const info = await transporter.sendMail(mailOptions);
  console.log('✅ Password notice sent', { id: info.messageId });
  return { messageId: info.messageId };
}
