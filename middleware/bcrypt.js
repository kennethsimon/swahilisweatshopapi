const bcrypt = require('bcryptjs');

module.exports = {

  sign: (value) => {
    return bcrypt.hashSync(value, 10)
  },

  compare: (value, hash) => {
    return bcrypt.compareSync(value, hash)
  }

}