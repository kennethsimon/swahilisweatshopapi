const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var category = new Schema({
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

var Category = mongoose.model('Category', category);

module.exports = Category;