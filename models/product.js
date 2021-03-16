const mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId

var product = new Schema({
  title: {
    type: String,
    required: true,
  },
  about: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  gallery: {
    type: [String],
    required: true,
  },
  tags: {
    type: [String],
  },
  price: {
    type: String,
    required: true,
  },
  category: {
    type: ObjectId,
    ref: 'Category',
    required: true,
  },
  subcategory: {
    type: ObjectId,
    ref: 'Subcategory',
    required: true,
  },
  brand: {
    type: ObjectId,
    ref: 'Brand',
    required: true,
  },
  client: {
    type: ObjectId,
    ref: 'Client',
    required: true,
  },
  size: {
    type: [String],
    required: true,
  },
  color: {
    type: [String],
    required: true,
  },
  quantity: {
    type: Number,
    default: 0,
  },
  gender: {
    type: String,
  },
  since: {
    type: Date,
    default: Date.now
  }
});

mongoose.models = {};

var Product = mongoose.model('Product', product);

module.exports = Product;