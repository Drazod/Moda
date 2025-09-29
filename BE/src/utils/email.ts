import nodemailer from 'nodemailer';

// Simple Gmail transporter with app password (avoids OAuth2 memory issues)
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465, // Use port 465 for SSL
  secure: true, // Use SSL
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // Use Gmail App Password
  },
  connectionTimeout: 60000, // 60 seconds
  greetingTimeout: 30000, // 30 seconds
  socketTimeout: 60000, // 60 seconds
});

export async function sendOtpEmail(to: string, otp: string) {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject: 'Your OTP Code',
      text: `Your OTP code is: ${otp}. It will expire in 10 minutes.`,
    };
    
    const info = await transporter.sendMail(mailOptions);
    console.log('OTP email sent successfully:', info.messageId);
    return info;
  } catch (error) {
    console.error('OTP email error:', error);
    throw error;
  }
}

export async function sendPasswordChangeNotification(to: string, name: string, rollbackToken: string) {
  try {
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
    
    const info = await transporter.sendMail(mailOptions);
    console.log('Password change notification sent successfully:', info.messageId);
    return info;
  } catch (error) {
    console.error('Password change notification error:', error);
    throw error;
  }
}
