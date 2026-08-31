import nodemailer from 'nodemailer';
import 'dotenv/config';

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  family: 4,
});

transporter.verify((error, success) => {
    if (error) {
        console.error('Mail server connection failed.');
        console.error(error.message);
    } else {
        console.log('Mail server is ready.');
    }
});

export default transporter;