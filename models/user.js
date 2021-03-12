const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var user = new Schema({
  name: {
    type: String,
  },
  mobile: {
    type: String,
    unique: true,
    required: true,
  },
  address: {
    type: String,
  },
  password: {
    type: String,
  },
  code: {
    type: String,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  since: {
    type: Date,
    default: Date.now
  }
});

mongoose.models = {};

var User = mongoose.model('User', user);

module.exports = User;