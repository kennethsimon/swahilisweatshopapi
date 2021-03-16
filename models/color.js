const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var color = new Schema({
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

var Color = mongoose.model('Color', color);

module.exports = Color;