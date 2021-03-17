const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var location = new Schema({
  title: {
    type: String,
    required: true
  },
  price: {
    type: String,
    required: true
  },
  since: {
    type: Date,
    default: Date.now
  }
});

mongoose.models = {};

var Location = mongoose.model('Location', location);

module.exports = Location;