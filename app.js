var express = require('express');
var path = require('path');
var logger = require('morgan');
require('dotenv').config();
var mongoose = require('mongoose');
var cookieParser = require('cookie-parser');

var routes = require('./routes');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect(process.env.MongoDBURL, {
  autoIndex: false,
  useCreateIndex: true,
  useNewUrlParser: true,
  useFindAndModify: false,
  useUnifiedTopology: true
}).catch(_error => {
  console.error('Could not connect to db');
});

// Using API routes
routes(app);

module.exports = app;