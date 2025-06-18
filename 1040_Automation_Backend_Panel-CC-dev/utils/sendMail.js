// utils/sendMail.js
const transporter = require('../middleware/mailer');

async function sendMail({ to, subject, text }) {
  return transporter.sendMail({
    from: process.env.SMTP_USER || 'your_email@example.com',
    to,
    subject,
    text
  });
}

module.exports = { sendMail };
