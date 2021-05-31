const db = require('../helpers/db')

module.exports = {

  getAllAndDetails: function (query) {
    const key = Object.values(query)
    return new Promise((resolve, reject) => {
      if (key) {
        db.query(`SELECT items.id, items.name, categories.name AS category_name, variants.description AS variant_description,items.price, items.created_at, items.updated_at FROM items LEFT JOIN item_categories ON item_categories.item_id = items.id LEFT JOIN categories ON categories.id = item_categories.category_id LEFT JOIN item_variants ON item_variants.item_id = items.id LEFT JOIN variants ON variants.id = items.variant_id WHERE items.name LIKE '%${key[0]}%'`, function (err, res) {
          if (!err) {
            resolve(res)
          } else {
            reject(err)
          }
        })
      } else {
        db.query('SELECT items.id, items.name, categories.name AS category_name, variants.description AS variant_description,items.price, items.created_at, items.updated_at FROM items LEFT JOIN item_categories ON item_categories.item_id = items.id LEFT JOIN categories ON categories.id = item_categories.category_id LEFT JOIN item_variants ON item_variants.item_id = items.id LEFT JOIN variants ON variants.id = items.variant_id', function (err, res) {
          if (!err) {
            resolve(res)
          } else {
            reject(err)
          }
        })
      }
    })
  },

  getPriceDetail: function (query) {
    const key = Object.values(query)
    return new Promise((resolve, reject) => {
      if (key[0] === undefined || key[0] === null) {
        db.query('SELECT items.id, items.name, categories.name AS category_name, variants.description AS variant_description,items.price, items.created_at, items.updated_at FROM items LEFT JOIN item_categories ON item_categories.item_id = items.id LEFT JOIN categories ON categories.id = item_categories.category_id LEFT JOIN item_variants ON item_variants.item_id = items.id LEFT JOIN variants ON variants.id = items.variant_id ORDER BY items.price ASC', function (err, res) {
          console.log(key[0])
          if (!err) {
            resolve(res)
          } else {
            console.log(err)
            reject(err)
          }
        })
      } else {
        db.query('SELECT items.id, items.name, categories.name AS category_name, variants.description AS variant_description,items.price, items.created_at, items.updated_at FROM items LEFT JOIN item_categories ON item_categories.item_id = items.id LEFT JOIN categories ON categories.id = item_categories.category_id LEFT JOIN item_variants ON item_variants.item_id = items.id LEFT JOIN variants ON variants.id = items.variant_id ORDER BY items.price DESC', function (err, res) {
          if (!err) {
            resolve(res)
          } else {
            console.log(err)
            reject(err)
          }
        })
      }
    })
  },

  postItems: function (data) {
    return new Promise((resolve, reject) => {
      db.query('INSERT INTO items SET ?', [data], function (err, res) {
        if (!err) {
          console.log(res)
          resolve(res)
        } else {
          reject(err)
        }
      })
    })
  },

  postItemsToItemCategory: function (id) {
    return new Promise((resolve, reject) => {
      db.query('INSERT INTO item_categories (item_categories.category_id, item_categories.item_id) SELECT items.category_id, items.id FROM items WHERE id=?', [id], function (err, res) {
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
  },

  postItemsToItemVariant: function (id) {
    return new Promise((resolve, reject) => {
      db.query('INSERT INTO item_variants (item_variants.variant_id, item_variants.item_id) SELECT items.variant_id, items.id FROM items WHERE id=?', [id], function (err, res) {
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

  updateItemDatas: function (data, id) {
    let dbGet
    db.query('SELECT * FROM items WHERE id=?', [id], function (err, res) {
      if (!err) {
        if (id.length > 0) {
          dbGet = res
        } else {
          return err
        }
      }
    })

    db.query('UPDATE items SET ? WHERE id=?', [data, id], function (err, res) {
      if (!err) {
        return res
      } else {
        return err
      }
    })

    return new Promise((resolve, reject) => {
      db.query('SELECT * FROM items WHERE id=?', [id], function (err, res) {
        console.log(res)
        if (!err) {
          const dataUpdated = {
            id: dbGet[0].id,
            initial: {
              name: dbGet[0].name,
              price: dbGet[0].price,
              created_at: dbGet[0].created_at,
              updated_at: dbGet[0].updated_at
            },
            changedData: {
              changed_name: res[0].name,
              changed_price: res[0].price,
              created_at: res[0].created_at,
              updated_at: res[0].updated_at
            }
          }
          resolve(dataUpdated)
        } else {
          reject(err)
        }
      })
    })
  },

  updateItemPartial: function (data) {
    return new Promise((resolve, reject) => {
      const key = Object.keys(data)
      const lastColumn = key[key.length - 1]
      db.query(`UPDATE items SET ${lastColumn}=? WHERE id=?`, [[data[lastColumn]], data.id], function (err, res) {
        if (data > 1) {
          reject(err)
          console.log(err, 'Oops, you have to put only one column')
        } else {
          resolve(res)
          console.log('ok')
        }
      })
    })
  },

  deleteItem: function (id) {
    return new Promise((resolve, reject) => {
      db.query('DELETE FROM items WHERE id=?', [id], function (err, res) {
        if (!err) {
          resolve(res)
        } else {
          reject(err)
        }
      })
    })
  }

}
