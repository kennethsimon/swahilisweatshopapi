const user = require('./user');
const photo = require('./photo');
const event = require('./event');
const brand = require('./brand');
const product = require('./product');
const category = require('./category');
const subcategory = require('./subcategory');

module.exports = (server) => {
  server.use('/user', user);
  server.use('/photo', photo);
  server.use('/event', event);
  server.use('/brand', brand);
  server.use('/product', product);
  server.use('/category', category);
  server.use('/subcategory', subcategory);
};