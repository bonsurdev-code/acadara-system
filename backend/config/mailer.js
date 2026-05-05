import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // Use SSL
    auth: {
        user: process.env.EMAIL_USER, // Your gmail
        pass: process.env.EMAIL_PASS  // Your App Password (not your login password)
    }
});

transporter.verify((error, success) => {
  if (error) {
    console.log("Nodemailer verification failed:", error);
  } else {
    console.log("Server is ready to take our messages");
  }
});

export const sendCredentialsEmail = async (email, acadara_email, name, password) => {
    const mailOptions = {
        from: `"Acadara Admin" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Welcome to Acadara - Your Mentor Account is Ready',
        html: `
            <div style="font-family: sans-serif; max-width: 600px; color: #333;">
                <h2>Hi ${name},</h2>
                <p>Your application to join **Acadara** has been approved!</p>
                <p>You can now log in using the credentials below:</p>
                <div style="background: #f4f4f4; padding: 15px; border-radius: 8px; border: 1px solid #ddd;">
                    <p><strong>Email:</strong> ${acadara_email}</p>
                    <p><strong>Temporary Password:</strong> ${password}</p>
                </div>
                <p style="font-size: 12px; color: #666;">Please change your password immediately after logging in.</p>
                <p>Welcome to the community!</p>
            </div>
        `
    };

    return transporter.sendMail(mailOptions);
};