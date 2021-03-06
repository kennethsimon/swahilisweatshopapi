require('dotenv').config();
const jwt = require('jsonwebtoken');

var options = {
  issuer: 'Swahilisweatshop',
  audience: 'Client',
  subject: 'Authorize',
  expiresIn: '30d',
  algorithm: 'HS256'
};

module.exports = {

  sign: (payload) => {
    var signOptions = {
      ...options
    };
    return jwt.sign(payload, process.env.JWTKey, signOptions);
  },

  verify: (payload) => {
    var verifyOptions = {
      ...options
    };
    try {
      return jwt.verify(payload, process.env.JWTKey, verifyOptions);
    } catch (e) {
      return false;
    }
  },

  decode: (token) => {
    return jwt.decode(token, { complete: true });
  }

};