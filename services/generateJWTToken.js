const jwt = require("jsonwebtoken");

function generateToken(signWith, secretKey) {
  const token = jwt.sign(signWith, secretKey, { expiresIn: "1d" });
  console.log({token})
  return token
}

module.exports = generateToken