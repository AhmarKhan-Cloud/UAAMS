const jwt = require("jsonwebtoken");
const env = require("../config/env");

const signAuthToken = (payload) => {
  return jwt.sign(payload, env.jwtSecret, { expiresIn: env.jwtExpiresIn });
};

const verifyAuthToken = (token) => {
  return jwt.verify(token, env.jwtSecret);
};

module.exports = {
  signAuthToken,
  verifyAuthToken,
};
