const db = require('../helpers/db')
const { promisify } = require('util')

const execPromise = promisify(db.query).bind(db)
module.exports = {

  getUserById: function (data) {
    return execPromise(`SELECT id, picture, name, username, user_address FROM users WHERE users.username LIKE '%${data.search}%' OR users.name LIKE '%${data.search}%'`)
  },

  getUserByIdSync: function (id, cb) {
    db.query('SELECT id, picture, name, username, user_address FROM users WHERE id=?', [id], cb)
  },

  findUserByUsername: function (data) {
    return execPromise('SELECT COUNT (*) username FROM users WHERE username=?', [data])
  },

  getUserSigned: function (id) {
    return execPromise('SELECT id, first_name, last_name, phone_number, picture, name, username, user_address FROM users WHERE id=?', [id])
  },

  getUserSignedForUpdate: function (id) {
    return execPromise('SELECT id, first_name, last_name, phone_number, picture, name, username, user_address FROM users WHERE id=?', [id])
  },

  updateUserInfo: function (data, id) {
    return new Promise((resolve, reject) => {
      db.query('UPDATE users SET ? WHERE id=?', [data, id], function (err, res) {
        if (!err) {
          resolve(res)
        } else {
          reject(err)
        }
      })
    })
  },

  confirmPassword: function (id) {
    return execPromise('SELECT * from users WHERE id=?', id)
  },

  updatePassword: function (data) {
    return new Promise((resolve, reject) => {
      const key = Object.keys(data)
      const lastColumn = key[key.length - 1]
      db.query(`UPDATE users SET ${lastColumn}=? WHERE id=?`, [[data[lastColumn]], data.id], function (err, res) {
        if (data > 1) {
          reject(err)
        } else {
          resolve(res)
        }
      })
    })
  }
}
