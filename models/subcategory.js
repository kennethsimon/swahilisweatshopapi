const mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId

var subcategory = new Schema({
  title: {
    type: String,
    required: true
  },
  category: {
    type: ObjectId,
    ref: 'Category'
  },
  since: {
    type: Date,
    default: Date.now
  }
});

mongoose.models = {};

var Subcategory = mongoose.model('Subcategory', subcategory);

module.exports = Subcategory;