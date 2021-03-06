const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var subcategory = new Schema({
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

var Subcategory = mongoose.model('Subcategory', subcategory);

module.exports = Subcategory;