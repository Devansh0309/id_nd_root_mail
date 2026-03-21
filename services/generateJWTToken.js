const jwt = require("jsonwebtoken");

function generateToken(signWith, secretKey) {
  return jwt.sign(signWith, secretKey, { expiresIn: "1d" });
}

module.exports = generateToken