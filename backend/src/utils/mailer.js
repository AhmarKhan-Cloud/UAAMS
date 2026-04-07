const nodemailer = require("nodemailer");
const env = require("../config/env");

let transporterCache = null;

const isSmtpConfigured = () =>
  Boolean(
    String(env.smtpHost || "").trim() &&
      Number(env.smtpPort || 0) > 0 &&
      String(env.smtpUser || "").trim() &&
      String(env.smtpPass || "").trim() &&
      String(env.smtpFrom || "").trim(),
  );

const getTransporter = () => {
  if (transporterCache) {
    return transporterCache;
  }

  transporterCache = nodemailer.createTransport({
    host: env.smtpHost,
    port: Number(env.smtpPort),
    secure: Boolean(env.smtpSecure),
    auth: {
      user: env.smtpUser,
      pass: env.smtpPass,
    },
  });

  return transporterCache;
};

const sendBloggerCredentialsEmail = async ({
  to,
  bloggerName,
  username,
  email,
  password,
  universityName,
}) => {
  if (!isSmtpConfigured()) {
    return {
      sent: false,
      reason: "SMTP is not configured. Set SMTP_* env values to enable emails.",
    };
  }

  const transporter = getTransporter();
  const subject = `UAAMS Blogger Account Credentials - ${universityName || "University"}`;

  const safeUniversityName = universityName || "your university";
  const safeBloggerName = bloggerName || "Blogger";

  const text = [
    `Hello ${safeBloggerName},`,
    "",
    `You have been added as a blogger for ${safeUniversityName} in UAAMS.`,
    "",
    "Login credentials:",
    `Username: ${username || "N/A"}`,
    `Email: ${email || "N/A"}`,
    `Password: ${password || "N/A"}`,
    "",
    "Please login and change your password after first sign in.",
  ].join("\n");

  await transporter.sendMail({
    from: env.smtpFrom,
    to,
    subject,
    text,
    html: `
      <p>Hello ${safeBloggerName},</p>
      <p>You have been added as a blogger for <strong>${safeUniversityName}</strong> in UAAMS.</p>
      <p><strong>Login credentials:</strong></p>
      <ul>
        <li>Username: ${username || "N/A"}</li>
        <li>Email: ${email || "N/A"}</li>
        <li>Password: ${password || "N/A"}</li>
      </ul>
      <p>Please login and change your password after first sign in.</p>
    `,
  });

  return { sent: true, reason: "" };
};

module.exports = {
  isSmtpConfigured,
  sendBloggerCredentialsEmail,
};
