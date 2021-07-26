const db = require('../helpers/db')
const { promisify } = require('util')

const exacPromise = promisify(db.query).bind(db)
module.exports = {

  getItemsByCategory: function (query) {
    return new Promise((resolve, reject) => {
      const key = query
      if (query.search) {
        db.query(`SELECT items.id, items.picture, items.name, categories.name AS category_name, items.price FROM items LEFT JOIN item_categories ON item_categories.item_id = items.id LEFT JOIN categories ON categories.id = item_categories.category_id WHERE categories.name LIKE '%${query.search}%' LIMIT ? OFFSET ?`, [query.limit, query.offset], function (err, res) {
          console.log(key)
          if (!err) {
            resolve(res)
          } else {
            reject(err)
          }
        })
      } else {
        db.query('SELECT items.id, items.picture, items.name, categories.name AS category_name, items.price FROM items LEFT JOIN item_categories ON item_categories.item_id = items.id LEFT JOIN categories ON categories.id = item_categories.category_id', function (err, res) {
          if (!err) {
            resolve(res)
          } else {
            reject(err)
          }
        })
      }
    })
  },

  getByCategory: function () {
    return exacPromise('SELECT categories.id, categories.name FROM categories')
  },

  getItemsCount: function (query) {
    return exacPromise(`SELECT COUNT (items.id) AS count FROM items LEFT JOIN item_categories ON item_categories.item_id = items.id LEFT JOIN categories ON categories.id = item_categories.category_id WHERE categories.name LIKE '%${query.search}%'`)
  },

  // exports.getCountProductByCategory = (id, cb) => { db.query(` SELECT COUNT(products.id) AS count FROM products LEFT JOIN product_categories on product_categories.id_product = products.id WHERE product_categories.id_category = ${id} `, cb)}

  postItemsToItemCategory: function (data, cb) {
    db.query('INSERT INTO item_categories ( item_id, category_id) VALUES (?, ?)', [data.item_id, data.category_id], cb)
  },

  postItemsToItemCategoryRaw: function (id) {
    return new Promise((resolve, reject) => {
      db.query('INSERT INTO item_categories (item_id) VALUES(?)', [id], function (err, res) {
        console.log(id)
        if (!err) {
          resolve(res)
        } else {
          console.log(err)
          reject(err)
        }
      })
    })
  },

  postCategoryItems: function (data) {
    return new Promise((resolve, reject) => {
      db.query('INSERT INTO categories SET ?', [data], function (err, res) {
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
