const db = require('../helpers/db')
const { promisify } = require('util')
const execPromise = promisify(db.query).bind(db)
module.exports = {

  postItemsToItemVariant: function (data, id) {
    return new Promise((resolve, reject) => {
      db.query('INSERT INTO item_variants SET ?', [data], function (err, res) {
        console.log(data)
        if (!err) {
          resolve(res)
        } else {
          reject(err)
        }
      })
    })
  },

  getItemsCount: function (query) {
    return execPromise(`SELECT COUNT (items.id) AS count FROM items WHERE items.name LIKE '%${query.search}%'`)
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

  getItemVariants: function (query) {
    const key = Object.keys(query.sort)[0]
    const sort = query.sort[key]
    if (query.variant) {
      return execPromise(`SELECT items.name, items.quantity, items.price AS base_price, items.delivery_on, items.item_description, item_variants.additional_price, (items.price + item_variants.additional_price) AS final_price, variants.variant_name AS variant, variants.variant_code AS variant_code FROM items INNER JOIN item_variants ON item_variants.item_id = items.id INNER JOIN variants ON item_variants.variant_id = variants.id WHERE items.name LIKE '%${query.variant}%' ORDER BY ${key} ${sort} LIMIT ? OFFSET ?`, [query.limit, query.offset])
    } else {
      return execPromise(`SELECT items.name, items.quantity, items.price AS base_price, items.delivery_on, items.item_description, item_variants.additional_price, (items.price + item_variants.additional_price) AS final_price, variants.variant_name AS variant, variants.variant_code AS variant_code FROM items INNER JOIN item_variants ON item_variants.item_id = items.id INNER JOIN variants ON item_variants.variant_id = variants.id ORDER BY ${key} ${sort} LIMIT ? OFFSET ?`, [query.limit, query.offset])
    }
  },

  getItemVariantsById: function (id) {
    return execPromise(`
    SELECT items.id, items.name , items.quantity, items.picture, items.price AS base_price, items.delivery_on, items.item_description, item_variants.additional_price, (items.price + item_variants.additional_price) AS final_price, variants.variant_name AS variant, variants.variant_code AS variant_code FROM items INNER JOIN item_variants ON item_variants.item_id = items.id INNER JOIN variants ON item_variants.variant_id = variants.id WHERE items.id=?`, [id])
  },

  getSpecificItemsVariant: function (query, id) {
    return execPromise(`
    SELECT items.id, items.name , items.quantity, items.price AS base_price, items.delivery_on, items.item_description, item_variants.additional_price, (items.price + item_variants.additional_price) AS final_price, variants.variant_name AS variant, variants.variant_code AS variant_code FROM items INNER JOIN item_variants ON item_variants.item_id = items.id INNER JOIN variants ON item_variants.variant_id = variants.id WHERE items.id=? AND variants.variant_code LIKE '${query.search}'`, [id])
  }

}
