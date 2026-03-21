const nodemailer = require("nodemailer");

const sendEmail = async (mailOptions) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com", // Explicit host
    port: 587, // TLS port
    secure: false, // Use TLS, not SSL
    auth: {
      user: process.env.EMAIL_USERNAME, // your_email@gmail.com
      pass: process.env.EMAIL_PASSWORD, // App password, not account password
    },
  });

  try {
    const send = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully", send);
  } catch (err) {
    console.error("Failed to send email", err);
    throw new Error(err);
  }
};

module.exports = sendEmail;
