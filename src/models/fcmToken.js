const { db } = require('../helpers/db')
const { promisify } = require('util')

const execPromise = promisify(db.query).bind(db)

module.exports = {

  createFCMToken: function (data) {
    return execPromise('INSERT INTO fcm_tokens (token, user_id) VALUE (?, ?)', [data.token, data.user_id])
  },

  findToken: function (data) {
    return execPromise('SELECT * FROM fcm_tokens LEFT JOIN users ON users.id = fcm_tokens.user_id WHERE user_id=?', [data])
  }

}
