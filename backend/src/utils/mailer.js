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

const sendPasswordResetOtpEmail = async ({ to, name, otp, validForMinutes = 10 }) => {
  if (!isSmtpConfigured()) {
    return {
      sent: false,
      reason: "SMTP is not configured. Set SMTP_* env values to enable emails.",
    };
  }

  const transporter = getTransporter();
  const safeName = name || "UAAMS user";
  const safeOtp = String(otp || "").trim();

  if (!safeOtp) {
    return {
      sent: false,
      reason: "OTP is missing for password reset email.",
    };
  }

  const subject = "UAAMS Password Reset OTP";
  const text = [
    `Hello ${safeName},`,
    "",
    "Use the OTP below to reset your UAAMS account password:",
    "",
    `OTP: ${safeOtp}`,
    "",
    `This OTP will expire in ${validForMinutes} minutes.`,
    "If you did not request this, ignore this email.",
  ].join("\n");

  await transporter.sendMail({
    from: env.smtpFrom,
    to,
    subject,
    text,
    html: `
      <p>Hello ${safeName},</p>
      <p>Use the OTP below to reset your UAAMS account password:</p>
      <p style=\"font-size:20px; font-weight:700; letter-spacing:2px;\">${safeOtp}</p>
      <p>This OTP will expire in <strong>${validForMinutes} minutes</strong>.</p>
      <p>If you did not request this, ignore this email.</p>
    `,
  });

  return { sent: true, reason: "" };
};

const sendEmailVerificationLinkEmail = async ({
  to,
  name,
  verificationUrl,
  validForHours = 24,
}) => {
  if (!isSmtpConfigured()) {
    return {
      sent: false,
      reason: "SMTP is not configured. Set SMTP_* env values to enable emails.",
    };
  }

  const safeVerificationUrl = String(verificationUrl || "").trim();
  if (!safeVerificationUrl) {
    return {
      sent: false,
      reason: "Verification URL is missing.",
    };
  }

  const transporter = getTransporter();
  const safeName = name || "UAAMS user";

  const subject = "Verify your UAAMS account email";
  const text = [
    `Hello ${safeName},`,
    "",
    "Welcome to UAAMS. Please verify your account by clicking the link below:",
    safeVerificationUrl,
    "",
    `This link will expire in ${validForHours} hours.`,
    "If you did not create this account, ignore this email.",
  ].join("\n");

  await transporter.sendMail({
    from: env.smtpFrom,
    to,
    subject,
    text,
    html: `
      <p>Hello ${safeName},</p>
      <p>Welcome to UAAMS. Please verify your account by clicking the button below:</p>
      <p><a href="${safeVerificationUrl}" style="display:inline-block; background:#059669; color:#ffffff; text-decoration:none; padding:10px 16px; border-radius:6px;">Verify Email</a></p>
      <p>This link will expire in <strong>${validForHours} hours</strong>.</p>
      <p>If you did not create this account, ignore this email.</p>
    `,
  });

  return { sent: true, reason: "" };
};

const parseDataUrlAttachment = ({ dataUrl, fallbackName, fallbackMimeType = "application/octet-stream" }) => {
  const source = String(dataUrl || "").trim();
  if (!source.startsWith("data:")) {
    return null;
  }

  const splitIndex = source.indexOf(",");
  if (splitIndex === -1) return null;

  const header = source.slice(0, splitIndex);
  const payload = source.slice(splitIndex + 1);
  const mimeMatch = header.match(/^data:([^;]+);base64$/i);
  if (!mimeMatch) {
    return null;
  }

  const mimeType = String(mimeMatch[1] || fallbackMimeType).trim() || fallbackMimeType;
  const ext = mimeType.split("/")[1] || "bin";
  const filenameBase = String(fallbackName || "document").trim().replace(/\s+/g, "_");

  try {
    return {
      filename: filenameBase.includes(".") ? filenameBase : `${filenameBase}.${ext}`,
      content: Buffer.from(payload, "base64"),
      contentType: mimeType,
    };
  } catch {
    return null;
  }
};

const sendRollNumberAssignedEmail = async ({
  to,
  studentName,
  universityName,
  applicationCode,
  program,
  rollNumber,
  slipFileUrl,
  slipFileName,
}) => {
  if (!isSmtpConfigured()) {
    return {
      sent: false,
      reason: "SMTP is not configured. Set SMTP_* env values to enable emails.",
    };
  }

  const transporter = getTransporter();
  const safeStudentName = studentName || "Student";
  const safeUniversityName = universityName || "University";
  const safeRollNumber = rollNumber || "N/A";

  const attachments = [];
  const parsedAttachment = parseDataUrlAttachment({
    dataUrl: slipFileUrl,
    fallbackName: slipFileName || "roll-number-slip.pdf",
    fallbackMimeType: "application/pdf",
  });
  if (parsedAttachment) {
    attachments.push(parsedAttachment);
  }

  const subject = `UAAMS Roll Number Assigned - ${safeUniversityName}`;
  const text = [
    `Hello ${safeStudentName},`,
    "",
    `Your roll number has been assigned by ${safeUniversityName}.`,
    `Application Code: ${applicationCode || "N/A"}`,
    `Program: ${program || "N/A"}`,
    `Roll Number: ${safeRollNumber}`,
    "",
    parsedAttachment
      ? "Your roll number slip is attached with this email."
      : slipFileUrl
      ? `Roll Slip Link: ${slipFileUrl}`
      : "Roll slip will be available in your student portal.",
  ].join("\n");

  await transporter.sendMail({
    from: env.smtpFrom,
    to,
    subject,
    text,
    html: `
      <p>Hello ${safeStudentName},</p>
      <p>Your roll number has been assigned by <strong>${safeUniversityName}</strong>.</p>
      <ul>
        <li>Application Code: ${applicationCode || "N/A"}</li>
        <li>Program: ${program || "N/A"}</li>
        <li>Roll Number: ${safeRollNumber}</li>
      </ul>
      ${
        parsedAttachment
          ? "<p>Your roll number slip is attached with this email.</p>"
          : slipFileUrl
          ? `<p>Roll Slip Link: <a href="${slipFileUrl}">${slipFileUrl}</a></p>`
          : "<p>Roll slip will be available in your student portal.</p>"
      }
    `,
    attachments,
  });

  return { sent: true, reason: "" };
};

const sendAdmissionLetterIssuedEmail = async ({
  to,
  studentName,
  universityName,
  applicationCode,
  program,
  letterNumber,
  fileUrl,
  fileName,
}) => {
  if (!isSmtpConfigured()) {
    return {
      sent: false,
      reason: "SMTP is not configured. Set SMTP_* env values to enable emails.",
    };
  }

  const transporter = getTransporter();
  const safeStudentName = studentName || "Student";
  const safeUniversityName = universityName || "University";
  const safeLetterNumber = letterNumber || "N/A";

  const attachments = [];
  const parsedAttachment = parseDataUrlAttachment({
    dataUrl: fileUrl,
    fallbackName: fileName || "admission-letter.pdf",
    fallbackMimeType: "application/pdf",
  });
  if (parsedAttachment) {
    attachments.push(parsedAttachment);
  }

  const subject = `UAAMS Admission Letter Issued - ${safeUniversityName}`;
  const text = [
    `Hello ${safeStudentName},`,
    "",
    `Your admission letter has been issued by ${safeUniversityName}.`,
    `Application Code: ${applicationCode || "N/A"}`,
    `Program: ${program || "N/A"}`,
    `Letter Number: ${safeLetterNumber}`,
    "",
    parsedAttachment
      ? "Your admission letter is attached with this email."
      : fileUrl
      ? `Admission Letter Link: ${fileUrl}`
      : "Admission letter is available in your student portal.",
  ].join("\n");

  await transporter.sendMail({
    from: env.smtpFrom,
    to,
    subject,
    text,
    html: `
      <p>Hello ${safeStudentName},</p>
      <p>Your admission letter has been issued by <strong>${safeUniversityName}</strong>.</p>
      <ul>
        <li>Application Code: ${applicationCode || "N/A"}</li>
        <li>Program: ${program || "N/A"}</li>
        <li>Letter Number: ${safeLetterNumber}</li>
      </ul>
      ${
        parsedAttachment
          ? "<p>Your admission letter is attached with this email.</p>"
          : fileUrl
          ? `<p>Admission Letter Link: <a href="${fileUrl}">${fileUrl}</a></p>`
          : "<p>Admission letter is available in your student portal.</p>"
      }
    `,
    attachments,
  });

  return { sent: true, reason: "" };
};

module.exports = {
  isSmtpConfigured,
  sendBloggerCredentialsEmail,
  sendPasswordResetOtpEmail,
  sendEmailVerificationLinkEmail,
  sendRollNumberAssignedEmail,
  sendAdmissionLetterIssuedEmail,
};
