const db = require('../helpers/db')
const { promisify } = require('util')

const execPromise = promisify(db.query).bind(db)

exports.createTransaction = (data, cb) => {
  db.query('INSERT INTO transactions (code, total, tax, shipping_cost, shipping_address, payment_method, user_id) VALUES (?, ?, ?, ?, ?, ?, ?)', [data.code, data.total, data.tax, data.shipping_cost, data.shipping_address, data.payment_method, data.user_id], cb)
}

exports.deleteTransaction = (id) => {
  return execPromise('DELETE FROM transactions WHERE id=?', [id])
}

exports.getAllTransactions = (id) => {
  return execPromise('SELECT transactions.id, transactions.code, transactions.total, transactions.tax, transactions.shipping_cost, transactions.shipping_address, transactions.payment_method FROM transactions WHERE user_id=?', [id])
}
