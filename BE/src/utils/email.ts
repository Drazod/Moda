import { fork } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

function runEmailWorker(args: {to:string; subject:string; html:string; fromName?: string;}): Promise<{id?:string}> {
  return new Promise((resolve, reject) => {
    // Determine worker script path depending on runtime (ts-node vs compiled)
    const jsPath = path.join(__dirname, 'email.worker.js');
    const tsPath = path.join(__dirname, 'email.worker.ts');
    let workerPath = jsPath;
    if (!fs.existsSync(jsPath)) {
      if (fs.existsSync(tsPath)) {
        // Run TypeScript worker through ts-node/register
        workerPath = tsPath;
        process.env.TS_NODE_TRANSPILE_ONLY = process.env.TS_NODE_TRANSPILE_ONLY || 'true';
        process.env.TS_NODE_COMPILER_OPTIONS = process.env.TS_NODE_COMPILER_OPTIONS || '{"module":"commonjs"}';
      } else {
        return reject(new Error(`Email worker script not found (.js nor .ts) at: ${jsPath}`));
      }
    }
    const execArgv = workerPath.endsWith('.ts') ? ['-r', 'ts-node/register'] : [];
    const child = fork(workerPath, [JSON.stringify(args)], {
      stdio: ['ignore', 'pipe', 'pipe', 'ipc']
      , execArgv
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
        const meta = {
          code,
          workerPath,
          stderr: err.trim(),
          stdout: out.trim(),
        };
        reject(new Error(err || `worker exited ${code}` + ' :: ' + JSON.stringify(meta)));
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
