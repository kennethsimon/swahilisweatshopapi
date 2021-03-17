const mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId

var cart = new Schema({
  products: {
    type: [Object],
    required: true,
  },
  total: {
    type: String,
    required: true,
  },
  location: {
    type: ObjectId,
    ref: 'Location',
  },
  delivery: {
    type: String,
    required: true,
    enum: ['shop', 'location'],
  },
  state: {
    type: String,
    required: true,
    enum: ['pending'],
    default: 'pending',
  },
  since: {
    type: Date,
    default: Date.now
  }
});

mongoose.models = {};

var Cart = mongoose.model('Cart', cart);

module.exports = Cart;