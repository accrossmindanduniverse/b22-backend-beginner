const db = require('../helpers/db')

exports.createTransaction = (data, cb) => {
  db.query('INSERT INTO transactions (code, total, tax, shipping_cost, shipping_address, payment_method, user_id) VALUES (?, ?, ?, ?, ?, ?, ?)', [data.code, data.total, data.tax, data.shipping_cost, data.shipping_address, data.payment_method, data.user_id], cb)
}
