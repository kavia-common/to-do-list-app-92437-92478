const nodemailer = require('nodemailer');

/**
 * Create a transporter using SMTP or a service.
 * Environment variables:
 * - SMTP_HOST, SMTP_PORT, SMTP_SECURE (true/false), SMTP_USER, SMTP_PASS
 * Or for common services: EMAIL_SERVICE (e.g., 'gmail') with SMTP_USER/SMTP_PASS
 */
const createTransporter = () => {
  if (process.env.EMAIL_SERVICE) {
    return nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    secure: process.env.SMTP_SECURE === 'true',
    auth: process.env.SMTP_USER
      ? {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        }
      : undefined,
  });
};

const transporter = createTransporter();

/**
 * PUBLIC_INTERFACE
 */
async function sendMail({ to, subject, html, text }) {
  /** Send an email using the configured transporter. */
  const from = process.env.EMAIL_FROM || process.env.SMTP_USER || 'no-reply@example.com';
  return transporter.sendMail({
    from,
    to,
    subject,
    text,
    html,
  });
}

module.exports = {
  sendMail,
};
