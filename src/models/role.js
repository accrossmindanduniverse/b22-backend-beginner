const { db } = require('../helpers/db')

module.exports = {

  createRoles: function (data) {
    return new Promise((resolve, reject) => {
      db.query('INSERT INTO roles SET ?', [data], function (err, res) {
        if (!err) {
          resolve(res)
        } else {
          reject(err)
        }
      })
    })
  }

  // postUserToUserRoles: function (data) {
  //   return new Promise((resolve, reject) => {
  //     db.query('INSERT INTO user_roles (user_id)', [data], function (err, res) {
  //       if (!err) {
  //         resolve(res)
  //       } else {
  //         reject(err)
  //       }
  //     })
  //   })
  // }

}
