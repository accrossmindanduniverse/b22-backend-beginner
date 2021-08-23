const { db } = require('../helpers/db')

exports.createItemTransaction = (data, cb) => {
  db.query('INSERT INTO item_transactions (name, price, variant, amount, item_id, transaction_id) VALUES (?, ?, ?, ?, ?, ?)', [data.name, data.price, data.variant, data.amount, data.item_id, data.transaction_id], cb)
}
