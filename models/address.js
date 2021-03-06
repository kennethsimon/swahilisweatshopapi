const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var address = new Schema({
  value: {
    type: String,
    required: true
  },
  since: {
    type: Date,
    default: Date.now
  }
});

mongoose.models = {};

var Address = mongoose.model('Address', address);

module.exports = Address;