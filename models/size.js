const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var size = new Schema({
  title: {
    type: String,
    required: true
  },
  since: {
    type: Date,
    default: Date.now
  }
});

mongoose.models = {};

var Size = mongoose.model('Size', size);

module.exports = Size;