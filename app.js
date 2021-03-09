var express = require('express');
var path = require('path');
var logger = require('morgan');
require('dotenv').config();
var mongoose = require('mongoose');
var cookieParser = require('cookie-parser');
const cors = require('cors');

var routes = require('./routes');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var allowedOrigins = [
  'http://swahilisweatshop.com',
  'https://swahilisweatshop.com',
  'http://swahilisweatshopdev.vercel.app',
  'https://swahilisweatshopdev.vercel.app',
  "http://localhost:3000"
];
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      var msg = 'The CORS policy does not allow specified origin';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true
}));

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