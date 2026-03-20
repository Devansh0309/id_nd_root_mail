const sendVerifyCodeToMail = async (req, res, next) => {
  try {
    //service api, external api, request, where server is a client requesting other server to send mail: send otp on mail for mail verification use NodeMailer or other service.
  } catch (error) {}
};

module.exports = sendVerifyCodeToMail


// import nodemailer from "nodemailer"


// const sendEmail = async (options) => {
//   const transporter = nodemailer.createTransport({
//     host: "smtp.gmail.com", // Explicit host
//     port: 587, // TLS port
//     secure: false, // Use TLS, not SSL
//     auth: {
//       user: process.env.EMAIL_USERNAME, // your_email@gmail.com
//       pass: process.env.EMAIL_PASSWORD, // App password, not account password
//     },
//   });

//   const mailOptions = {
//     from: `BidsBeat <${process.env.EMAIL_USERNAME}>`,
//     to: options.email,
//     subject: options.subject,
//     text: options.message,
//   };

//   try {
//     const send = await transporter.sendMail(mailOptions);
//     console.log("Email sent successfully", send);
//   } catch (err) {
//     console.error("Failed to send email", err);
//   }
// };

// export default sendEmail;