import nodemailer from 'nodemailer';

// Configure this with your real credentials or use environment variables
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendOtpEmail(to: string, otp: string) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: 'Your OTP Code',
    text: `Your OTP code is: ${otp}. It will expire in 10 minutes.`,
  };
  await transporter.sendMail(mailOptions);
}

export async function sendPasswordChangeNotification(to: string, name: string, rollbackToken: string) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: 'Password Changed Successfully',
    html: `
      <h2>Password Changed</h2>
      <p>Hi ${name},</p>
      <p>Your password has been successfully changed on ${new Date().toLocaleString()}.</p>
      <p><strong>If you did not make this change, click the link below to restore your previous password:</strong></p>
      <p><a href="${process.env.SERVER_URL}/auth/rollback-password?token=${rollbackToken}" style="background-color: #ff4444; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">RESTORE PREVIOUS PASSWORD</a></p>
      <p>This link will expire in 24 hours.</p>
      <br>
      <p>Best regards,<br>Your Security Team</p>
    `,
  };
  await transporter.sendMail(mailOptions);
}
