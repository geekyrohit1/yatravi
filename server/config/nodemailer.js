const nodemailer = require('nodemailer');

console.log(`[SMTP] Configuring for ${process.env.EMAIL_USER || 'yatraviholidays@gmail.com'}`);
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'yatraviholidays@gmail.com',
    pass: process.env.EMAIL_PASS
  }
});

// Verify SMTP connection
transporter.verify((error, success) => {
  if (error) {
    console.error('[SMTP] Connection Error:', error.message);
  } else {
    console.log('[SMTP] Server is ready to take our messages');
  }
});

module.exports = transporter;
