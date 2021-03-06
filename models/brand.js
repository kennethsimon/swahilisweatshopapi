const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var brand = new Schema({
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

var Brand = mongoose.model('Brand', brand);

module.exports = Brand;