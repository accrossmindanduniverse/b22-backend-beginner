const db = require('../helpers/db')

module.exports = {

  postItemsToItemVariant: function (data, id) {
    return new Promise((resolve, reject) => {
      db.query('INSERT INTO item_variants SET ? SELECT items.id FROM items WHERE id=?', [data, id], function (err, res) {
        console.log(data)
        if (!err) {
          resolve(res)
        } else {
          reject(err)
        }
      })
    })
  },

  postItemsToVariantItem: function (data) {
    return new Promise((resolve, reject) => {
      db.query('INSERT INTO variants SET ?', [data], function (err, res) {
        if (!err) {
          resolve(res)
        } else {
          reject(err)
        }
      })
    })
  },

  getItemVariants: function (key) {
    return new Promise((resolve, reject) => {
      console.log(key)
      if (key.variant) {
        db.query(`SELECT items.name, items.price AS base_price, items.delivery_on, items.item_description, item_variants.additional_price, (items.price + item_variants.additional_price) AS final_price, variants.variant_name AS variant, variants.variant_code AS variant_code FROM items INNER JOIN item_variants ON item_variants.item_id = items.id INNER JOIN variants ON item_variants.variant_id = variants.id WHERE items.name LIKE '%${key.variant}%' ORDER BY '%${key.variant}%'`, function (err, res) {
          if (!err) {
            resolve(res)
          } else {
            reject(err)
          }
        })
      } else {
        db.query('SELECT items.name, items.price AS base_price, items.delivery_on, items.item_description, item_variants.additional_price, (items.price + item_variants.additional_price) AS final_price, variants.variant_name AS variant, variants.variant_code AS variant_code FROM items INNER JOIN item_variants ON item_variants.item_id = items.id INNER JOIN variants ON item_variants.variant_id = variants.id', function (err, res) {
          if (!err) {
            resolve(res)
          } else {
            reject(err)
          }
        })
      }
    })
  }

}
