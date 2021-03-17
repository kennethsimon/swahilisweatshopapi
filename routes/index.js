const user = require('./user');
const size = require('./size');
const cart = require('./cart');
const photo = require('./photo');
const event = require('./event');
const brand = require('./brand');
const color = require('./color');
const product = require('./product');
const category = require('./category');
const location = require('./location');
const eventvote = require('./eventvote');
const subcategory = require('./subcategory');

module.exports = (server) => {
  server.use('/user', user);
  server.use('/photo', photo);
  server.use('/event', event);
  server.use('/brand', brand);
  server.use('/size', size);
  server.use('/cart', cart);
  server.use('/color', color);
  server.use('/product', product);
  server.use('/category', category);
  server.use('/location', location);
  server.use('/eventvote', eventvote);
  server.use('/subcategory', subcategory);
};