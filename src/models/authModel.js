const db = require('../helpers/db')
const { promisify } = require('util')

const execPromise = promisify(db.query).bind(db)
module.exports = {

  signUp: function (data) {
    return execPromise('INSERT INTO users (role, name, username, password) VALUE (?, ?, ?, ?)', [data.role, data.name, data.username, data.password])
  },

  signIn: function (username) {
    return execPromise(`
      SELECT id, role, username, password FROM users WHERE username=?
      `, [username])
  }

}
