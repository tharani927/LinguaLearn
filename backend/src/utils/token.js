const jwt = require('jsonwebtoken');
const config = require('../config/env');

const signToken = (payload) => {
  return jwt.sign(payload, config.JWT.secret, {
    expiresIn: config.JWT.expiresIn,
  });
};

const verifyToken = (token) => {
  return jwt.verify(token, config.JWT.secret);
};

module.exports = {
  signToken,
  verifyToken,
};
