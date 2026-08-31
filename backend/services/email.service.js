import transporter from '../config/mailer.js';

export const sendMentorWelcomeEmail = async ({ to, name, acadara_email, password }) => {
  const mailOptions = {
    from: `"Acadara Team" <${process.env.EMAIL_USER}>`,
    to,
    subject: '✨ Your Acadara Mentor Account is Ready!',
    text: `Welcome to Acadara, ${name}!\n\nYour application has been approved.\nAccess Email: ${acadara_email}\nTemporary Password: ${password}\n\nPlease change your password after logging in.`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            .container { font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #1e293b; }
            .header { text-align: center; padding-bottom: 20px; }
            .card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 16px; padding: 32px; }
            .welcome { font-size: 24px; font-weight: 800; color: #4f46e5; margin-bottom: 16px; }
            .credentials-box { background: #ffffff; border: 1px dashed #cbd5e1; border-radius: 12px; padding: 20px; margin: 24px 0; }
            .label { font-size: 10px; font-weight: bold; text-transform: uppercase; color: #64748b; letter-spacing: 0.05em; }
            .value { font-family: monospace; font-size: 16px; color: #0f172a; margin-bottom: 12px; }
            .button { display: inline-block; background: #4f46e5; color: #ffffff !important; padding: 14px 28px; border-radius: 10px; text-decoration: none; font-weight: bold; font-size: 14px; margin-top: 10px; }
            .footer { text-align: center; font-size: 12px; color: #94a3b8; margin-top: 30px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="card">
              <h1 class="welcome">Welcome to the inner circle, ${name}.</h1>
              <p>Your application to join <strong>Acadara</strong> as a mentor has been officially approved. We’re excited to have your expertise on board.</p>
              
              <div class="credentials-box">
                <div class="label">Access Email</div>
                <div class="value">${acadara_email}</div>
                <div class="label">Temporary Password</div>
                <div class="value">${password}</div>
                <p style="font-size: 11px; color: #f43f5e; margin: 0;">*For security, please change this password immediately after logging in.</p>
              </div>
            </div>
            <div class="footer">
              &copy; ${new Date().getFullYear()} Acadara Inc. <br>
              If you didn't request this, please ignore this email.
            </div>
          </div>
        </body>
      </html>
    `,
  };

  return await transporter.sendMail(mailOptions);
};