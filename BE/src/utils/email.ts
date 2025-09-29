import { fork } from 'node:child_process';
import path from 'node:path';

function runEmailWorker(args: {to:string; subject:string; html:string; fromName?: string;}): Promise<{id?:string}> {
  return new Promise((resolve, reject) => {
    const workerPath = path.join(__dirname, 'email.worker.js'); // build xong sẽ là .js
    const child = fork(workerPath, [JSON.stringify(args)], {
      stdio: ['ignore', 'pipe', 'pipe', 'ipc']
    });

    let out = '';
    let err = '';

    child.stdout?.on('data', (d) => { out += d.toString(); });
    child.stderr?.on('data', (d) => { err += d.toString(); });

    child.on('exit', (code) => {
      if (code === 0) {
        try {
          const parsed = JSON.parse(out || '{}');
          resolve({ id: parsed.id });
        } catch {
          resolve({ id: undefined });
        }
      } else {
        reject(new Error(err || `worker exited ${code}`));
      }
    });
  });
}
export async function sendOtpEmail(to: string, otp: string) {
  const html = `<p>Mã OTP của bạn: <b>${otp}</b>.</p><p>Mã sẽ hết hạn sau 10 phút.</p>`;
  const subject = 'Mã OTP của bạn';
  const res = await runEmailWorker({ to, subject, html, fromName: 'Your App' });
  console.log('✅ OTP sent', { id: res.id });
  return { messageId: res.id };
}

export async function sendPasswordChangeNotification(to: string, name: string, rollbackToken: string) {
  const url = `${process.env.SERVER_URL}/auth/rollback-password?token=${encodeURIComponent(rollbackToken)}`;
  const html = `
    <h2>Đổi mật khẩu</h2>
    <p>Xin chào ${name},</p>
    <p>Mật khẩu của bạn đã được đổi lúc ${new Date().toLocaleString('vi-VN',{ timeZone: 'Asia/Ho_Chi_Minh' })}.</p>
    <p><strong>Nếu không phải bạn thực hiện</strong>, nhấn liên kết dưới đây để khôi phục mật khẩu trước đó:</p>
    <p><a href="${url}" style="background:#ff4444;color:#fff;padding:10px 16px;border-radius:6px;text-decoration:none">Khôi phục mật khẩu trước đó</a></p>
    <p>Liên kết hết hạn sau 24 giờ.</p>`;
  const subject = 'Đổi mật khẩu thành công';
  const res = await runEmailWorker({ to, subject, html, fromName: 'Security' });
  console.log('✅ Password notice sent', { id: res.id });
  return { messageId: res.id };
}
