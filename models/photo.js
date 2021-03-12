const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var photo = new Schema({
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
  url: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  votes: {
    type: Number,
    default: 0,
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

var Photo = mongoose.model('Photo', photo);

module.exports = Photo;