const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var client = new Schema({
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

var Client = mongoose.model('Client', client);

module.exports = Client;