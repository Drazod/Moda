import { google } from 'googleapis';
import nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

// Gmail API configuration
const oauth2Client = new google.auth.OAuth2(
  process.env.GMAIL_CLIENT_ID,
  process.env.GMAIL_CLIENT_SECRET,
  'https://developers.google.com/oauthplayground'
);

oauth2Client.setCredentials({
  refresh_token: process.env.GMAIL_REFRESH_TOKEN,
});

// Create transporter with Gmail API (avoids SMTP port issues)
async function createTransporter() {
  console.log('🔧 Creating Gmail transporter...');
  console.log('📧 Email User:', process.env.EMAIL_USER ? 'Set' : 'Missing');
  console.log('🔑 Gmail Client ID:', process.env.GMAIL_CLIENT_ID ? 'Set' : 'Missing');
  console.log('🔒 Gmail Client Secret:', process.env.GMAIL_CLIENT_SECRET ? 'Set' : 'Missing');
  console.log('🔄 Gmail Refresh Token:', process.env.GMAIL_REFRESH_TOKEN ? 'Set' : 'Missing');
  
  try {
    console.log('🔐 Getting OAuth2 access token...');
    const accessToken = await oauth2Client.getAccessToken();
    console.log('✅ Access token obtained:', accessToken.token ? 'Success' : 'Failed');
    
    const transportOptions: SMTPTransport.Options = {
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        type: 'OAuth2',
        user: process.env.EMAIL_USER!,
        clientId: process.env.GMAIL_CLIENT_ID!,
        clientSecret: process.env.GMAIL_CLIENT_SECRET!,
        refreshToken: process.env.GMAIL_REFRESH_TOKEN!,
        accessToken: accessToken.token!,
      },
    };
    
    console.log('🚀 Creating nodemailer transporter with OAuth2...');
    const transporter = nodemailer.createTransport(transportOptions);
    console.log('✅ Transporter created successfully');
    return transporter;
  } catch (error) {
    console.error('❌ Gmail API setup failed:', error);
    console.error('🔍 Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      code: error instanceof Error ? (error as any).code : 'Unknown',
      stack: error instanceof Error ? error.stack : 'No stack trace'
    });
    throw error;
  }
}

export async function sendOtpEmail(to: string, otp: string) {
  console.log('📨 Starting OTP email send...');
  console.log('📧 Recipient:', to);
  console.log('🔢 OTP:', otp ? 'Generated' : 'Missing');
  
  try {
    console.log('🔧 Getting transporter...');
    const transporter = await createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject: 'Your OTP Code',
      text: `Your OTP code is: ${otp}. It will expire in 10 minutes.`,
    };
    
    console.log('📤 Sending OTP email...');
    console.log('📋 Mail options:', {
      from: mailOptions.from,
      to: mailOptions.to,
      subject: mailOptions.subject
    });
    
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ OTP email sent successfully!');
    console.log('📨 Message ID:', info.messageId);
    console.log('📮 Response:', info.response);
    return info;
  } catch (error) {
    console.error('❌ OTP email error:', error);
    console.error('🔍 Error type:', typeof error);
    console.error('🔍 Error details:', error instanceof Error ? error.message : 'Unknown error');
    throw error;
  }
}

export async function sendPasswordChangeNotification(to: string, name: string, rollbackToken: string) {
  console.log('🔐 Starting password change notification...');
  console.log('📧 Recipient:', to);
  console.log('👤 Name:', name);
  console.log('🔑 Rollback token:', rollbackToken ? 'Generated' : 'Missing');
  console.log('🌐 Server URL:', process.env.SERVER_URL ? 'Set' : 'Missing');
  
  try {
    console.log('🔧 Getting transporter...');
    const transporter = await createTransporter();
    
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
    
    console.log('📤 Sending password change notification...');
    console.log('📋 Mail options:', {
      from: mailOptions.from,
      to: mailOptions.to,
      subject: mailOptions.subject
    });
    
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Password change notification sent successfully!');
    console.log('📨 Message ID:', info.messageId);
    console.log('📮 Response:', info.response);
    return info;
  } catch (error) {
    console.error('❌ Password change notification error:', error);
    console.error('🔍 Error type:', typeof error);
    console.error('🔍 Error details:', error instanceof Error ? error.message : 'Unknown error');
    throw error;
  }
}
