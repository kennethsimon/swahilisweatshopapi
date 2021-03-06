const user = require('./user');

module.exports = (server) => {
  server.use('/user', user);
};