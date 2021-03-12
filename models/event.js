const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var event = new Schema({
  title: {
    type: String,
    required: true,
  },
  about: {
    type: String,
    required: true,
  },
  venue: {
    type: String,
    required: true,
  },
  gallery: {
    type: [String],
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  rates: {
    votes: {
      type: Number,
      default: 0,
    },
    total: {
      type: Number,
      default: 0,
    },
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  since: {
    type: Date,
    default: Date.now
  }
});

mongoose.models = {};

var Event = mongoose.model('Event', event);

module.exports = Event;