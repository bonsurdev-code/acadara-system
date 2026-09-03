import { google } from 'googleapis';
import 'dotenv/config';

// 1. Initialize OAuth2 Client
const oauth2Client = new google.auth.OAuth2(
  process.env.GMAIL_CLIENT_ID,
  process.env.GMAIL_CLIENT_SECRET
);

// 2. Set Refresh Token (Google SDK automatically handles access token renewal)
oauth2Client.setCredentials({
  refresh_token: process.env.GMAIL_REFRESH_TOKEN,
});

const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

/**
 * Encodes raw email content to Base64URL format required by Gmail API
 */
const encodeMessage = (message) => {
  return Buffer.from(message)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
};

/**
 * Sends email using Gmail API REST endpoint over HTTPS
 */
export const sendMentorWelcomeEmail = async ({ to, name, acadara_email, password }) => {
  // Construct RFC 2822 formatted message string
  const rawMessage = [
    `From: Acadara Team <${process.env.GMAIL_USER}>`,
    `To: ${to}`,
    `Subject: =?utf-8?B?${Buffer.from('✨ Your Acadara Mentor Account is Ready!').toString('base64')}?=`,
    'Content-Type: text/html; charset=utf-8',
    'MIME-Version: 1.0',
    '',
    `<!DOCTYPE html>
    <html>
      <body style="font-family: sans-serif; color: #1e293b;">
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 16px; padding: 32px; max-width: 600px;">
          <h1 style="color: #4f46e5; margin-top: 0;">Welcome to the inner circle, ${name}.</h1>
          <p>Your application to join <strong>Acadara</strong> as a mentor has been officially approved.</p>
          
          <div style="background: #ffffff; border: 1px dashed #cbd5e1; border-radius: 12px; padding: 20px; margin-bottom: 20px;">
            <p style="margin: 0 0 10px 0;"><strong>Access Email:</strong> ${acadara_email}</p>
            <p style="margin: 0;"><strong>Temporary Password:</strong> ${password}</p>
          </div>

          <!-- Password Warning Notice -->
          <div style="background: #fffbeb; border: 1px solid #fef3c7; border-left: 4px solid #f59e0b; border-radius: 8px; padding: 14px 16px;">
            <p style="margin: 0; color: #92400e; font-size: 14px; font-weight: 600;">
              ⚠️ Security Action Required:
            </p>
            <p style="margin: 4px 0 0 0; color: #b45309; font-size: 13px; line-height: 1.5;">
              This password is temporary. Please log in and <strong>change your password immediately</strong> from your profile settings to keep your account secure.
            </p>
          </div>
        </div>
      </body>
    </html>`,
  ].join('\r\n');

  const encodedMessage = encodeMessage(rawMessage);

  try {
    const response = await gmail.users.messages.send({
      userId: 'me',
      requestBody: {
        raw: encodedMessage,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Failed to send email via Gmail API:', error);
    throw error;
  }
};

/**
 * Sends OTP Email using Gmail API REST endpoint
 */
export const sendOTPEmail = async ({ to, otp }) => {
  const rawMessage = [
    `From: Acadara Team <${process.env.GMAIL_USER}>`,
    `To: ${to}`,
    `Subject: =?utf-8?B?${Buffer.from('🔑 Your Acadara Verification Code').toString('base64')}?=`,
    'Content-Type: text/html; charset=utf-8',
    'MIME-Version: 1.0',
    '',
    `<!DOCTYPE html>
    <html>
      <body style="font-family: sans-serif; color: #1e293b; background-color: #f8fafc; padding: 24px;">
        <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; padding: 32px; max-width: 500px; margin: 0 auto; text-align: center;">
          <h1 style="color: #4f46e5; margin-bottom: 8px;">Verify Your Email</h1>
          <p style="color: #64748b;">Use the 6-digit verification code below to complete your registration on <strong>Acadara</strong>.</p>
          <div style="background: #f1f5f9; border-radius: 12px; padding: 16px; margin: 24px 0;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #0f172a;">${otp}</span>
          </div>
          <p style="font-size: 14px; color: #94a3b8;">This code will expire in 10 minutes.</p>
        </div>
      </body>
    </html>`,
  ].join('\r\n');

  const encodedMessage = encodeMessage(rawMessage);

  try {
    const response = await gmail.users.messages.send({
      userId: 'me',
      requestBody: { raw: encodedMessage },
    });
    return response.data;
  } catch (error) {
    console.error('Failed to send OTP email via Gmail API:', error);
    throw error;
  }
};