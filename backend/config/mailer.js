import nodemailer from 'nodemailer';
import dns from 'node:dns';
import 'dotenv/config';

// Force Node's internal DNS resolver to prefer IPv4 globally
dns.setDefaultResultOrder('ipv4first');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // Port 465 requires secure: true
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  // Custom DNS lookup to strictly reject IPv6 (family 4)
  lookup: (hostname, options, callback) => {
    return dns.lookup(hostname, { family: 4 }, callback);
  },
  connectionTimeout: 10000, // 10s timeout
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