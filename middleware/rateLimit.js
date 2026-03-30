const rateLimit = require("express-rate-limit");

const otpLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 min
  max: 3, // max 3 requests per minute per IP
  message: "Too many OTP requests, try later",
});
module.exports = otpLimiter