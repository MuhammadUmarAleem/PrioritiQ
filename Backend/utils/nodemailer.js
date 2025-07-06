const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
});

const sendVerificationEmail = async (to, name, verificationToken) => {
  await transporter.sendMail({
    from: `PrioritiQ <${process.env.MAIL_USER}>`,
    to,
    subject: "Email Verification - PrioritiQ",
    html: `
      <p>Dear ${name},</p>

      <p>Thank you for registering with <strong>PrioritiQ</strong>.</p>

      <p>To complete your registration, please use the following verification token:</p>

      <h2 style="color: #2c3e50;">${verificationToken}</h2>

      <p>Copy and paste this token into the verification form on the website to verify your email address.</p>

      <p>If you did not create an account, please disregard this email.</p>

      <br>

      <p>Best regards,<br>
      PrioritiQ Team</p>
    `
  });
};


module.exports = { transporter, sendVerificationEmail };
