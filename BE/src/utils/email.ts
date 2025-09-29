import { google } from 'googleapis';
import nodemailer from 'nodemailer';

// Gmail API configuration
const oauth2Client = new google.auth.OAuth2(
  process.env.GMAIL_CLIENT_ID,
  process.env.GMAIL_CLIENT_SECRET,
  'https://developers.google.com/oauthplayground' // redirect URL
);

oauth2Client.setCredentials({
  refresh_token: process.env.GMAIL_REFRESH_TOKEN,
});

// Create transporter using Gmail API
const createGmailTransporter = async () => {
  // Check if Gmail API credentials are available
  if (process.env.GMAIL_CLIENT_ID && process.env.GMAIL_CLIENT_SECRET && process.env.GMAIL_REFRESH_TOKEN) {
    console.log('Attempting to use Gmail API...');
    
    try {
      const accessToken = await oauth2Client.getAccessToken();
      
      console.log('Gmail API access token obtained successfully');
      return nodemailer.createTransport({
        service: 'gmail',
        auth: {
          type: 'OAuth2',
          user: process.env.EMAIL_USER,
          clientId: process.env.GMAIL_CLIENT_ID,
          clientSecret: process.env.GMAIL_CLIENT_SECRET,
          refreshToken: process.env.GMAIL_REFRESH_TOKEN,
          accessToken: accessToken.token,
        },
      });
    } catch (error) {
      console.error('Failed to create Gmail API transporter:', error);
      console.log('Falling back to Gmail app password method...');
    }
  } else {
    console.log('Gmail API credentials not found, using app password method...');
  }
  
  // Fallback to app password method
  if (!process.env.EMAIL_PASS) {
    throw new Error('Neither Gmail API credentials nor app password found. Please check environment variables.');
  }
  
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

export async function sendOtpEmail(to: string, otp: string) {
  try {
    const transporter = await createGmailTransporter();
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
    const transporter = await createGmailTransporter();
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
