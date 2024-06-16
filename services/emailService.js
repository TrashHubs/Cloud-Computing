const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const sendVerifyEmail = (email, link) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "[TrashHub] Please verify your email",
    html: `<p>Hello,</p>
          <p>Please verify your email by clicking on the following link.</p>
          <p><a href="${link}" target="_blank">${link}</a></p>
          <p>If you did not create an account on TrashHub, please ignore this email.</p>
          <p>Thanks,</p>
          <p>TrashHub Team</p>`
  };

  return transporter.sendMail(mailOptions);
};

const sendResetPasswordEmail = (email, pin) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "[TrashHub] Reset Password PIN",
    html: `</p>Hello, ${email}</p>
          <p>Your reset password PIN is <strong>${pin}</strong>. It is valid for 1 hour.</p>
          <p>If you did not request a password reset, please ignore this email.</p>
          <p>Thanks,</p>
          <p>TrashHub Team</p>`
  };

  return transporter.sendMail(mailOptions);
};

module.exports = { sendVerifyEmail, sendResetPasswordEmail };
