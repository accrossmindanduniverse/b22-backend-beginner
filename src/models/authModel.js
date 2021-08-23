const { db } = require('../helpers/db')
const { promisify } = require('util')

const execPromise = promisify(db.query).bind(db)
module.exports = {

  signUp: function (data) {
    return execPromise('INSERT INTO users (role, username, password, phone_number) VALUE (?, ?, ?, ?)', [data.role, data.username, data.password, data.phone_number])
  },

  signIn: function (username) {
    return execPromise(`
      SELECT id, role, picture, first_name, last_name, name, phone_number, user_address, username, password FROM users WHERE username=?
      `, [username])
  }

}
