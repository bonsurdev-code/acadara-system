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
          <h1 style="color: #4f46e5;">Welcome to the inner circle, ${name}.</h1>
          <p>Your application to join <strong>Acadara</strong> as a mentor has been officially approved.</p>
          <div style="background: #ffffff; border: 1px dashed #cbd5e1; border-radius: 12px; padding: 20px;">
            <p><strong>Access Email:</strong> ${acadara_email}</p>
            <p><strong>Temporary Password:</strong> ${password}</p>
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