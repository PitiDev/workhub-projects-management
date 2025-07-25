const nodemailer = require('nodemailer');

// Configure transporter using environment variables
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT) : 587,
  secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

/**
 * Send an email
 * @param {Object} options
 * @param {string} options.to - Recipient email address
 * @param {string} options.subject - Email subject
 * @param {string} options.text - Plain text body
 * @param {string} [options.html] - HTML body (optional)
 * @returns {Promise}
 */
async function sendMail({ to, subject, text, html }) {
  const mailOptions = {
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to,
    subject,
    text,
    html
  };
  return transporter.sendMail(mailOptions);
}

/**
 * Generate a modern HTML email template
 * @param {Object} options
 * @param {string} options.title - Main title of the email
 * @param {string} options.body - Main body text (can include HTML)
 * @param {string} options.buttonText - Text for the call-to-action button
 * @param {string} options.buttonUrl - URL for the button
 * @returns {string} HTML string
 */
function generateEmailTemplate({ title, body, buttonText, buttonUrl }) {
  return `
    <div style="font-family: 'Inter', Arial, sans-serif; background: #f6f8fb; padding: 40px 0;">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 480px; margin: 0 auto; background: #fff; border-radius: 12px; box-shadow: 0 2px 8px rgba(60,72,88,0.07);">
        <tr>
          <td style="padding: 32px 32px 16px 32px; text-align: center;">
            <div style="font-size: 28px; font-weight: bold; color: #4f46e5; margin-bottom: 8px;">Project Management</div>
            <div style="font-size: 18px; color: #222; font-weight: 600; margin-bottom: 16px;">${title}</div>
            <div style="font-size: 15px; color: #444; margin-bottom: 32px; line-height: 1.6;">${body}</div>
            <a href="${buttonUrl}" style="display: inline-block; padding: 12px 32px; background: linear-gradient(90deg, #6366f1, #a21caf); color: #fff; border-radius: 6px; font-weight: 600; text-decoration: none; font-size: 16px; box-shadow: 0 2px 6px rgba(99,102,241,0.12);">${buttonText}</a>
          </td>
        </tr>
        <tr>
          <td style="padding: 24px 32px 0 32px; text-align: center; font-size: 13px; color: #888;">
            This is an automated notification from Project Management.<br>
            &copy; ${new Date().getFullYear()} Project Management
          </td>
        </tr>
      </table>
    </div>
  `;
}

module.exports = {
  sendMail,
  generateEmailTemplate
}; 