const mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId

var eventvote = new Schema({
  user: {
    type: ObjectId,
    ref: 'User',
    required: true,
  },
  event: {
    type: ObjectId,
    ref: 'Event',
    required: true,
  },
  votes: {
    type: Number,
    default: 0,
  },
  type: {
    type: String,
    required: true,
  },
  awareness: {
    type: String,
    required: true,
  },
  participateagain: {
    type: Boolean,
    required: true,
  },
  since: {
    type: Date,
    default: Date.now
  }
});

mongoose.models = {};

var Eventvote = mongoose.model('Eventvote', eventvote);

module.exports = Eventvote;