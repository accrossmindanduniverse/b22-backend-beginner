const db = require('../helpers/db')

module.exports = {
  postCategoryItems: function (data) {
    return new Promise((resolve, reject) => {
      db.query('INSERT INTO categories (category_id, item_id) VALUES ?', [data], function (err, res) {
        if (!err) {
          console.log('test', res)
          resolve(res)
        } else {
          reject(err)
        }
      })
    })
  }

}
