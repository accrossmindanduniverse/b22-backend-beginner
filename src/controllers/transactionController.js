const helper = require('../helpers')
const { codeTransaction } = require('../helpers/transaction')
const { getItemsByIdSync } = require('../models/itemModels')
const { createItemTransaction } = require('../models/itemTransaction')
const { createTransaction, getAllTransactions, deleteTransaction } = require('../models/transactionModels')
const { getUserByIdSync } = require('../models/userModels')
const { APP_TRANSACTION_PREFIX } = process.env

module.exports = {

  createTransaction: function (req, res) {
    console.log(req.body)
    const data = req.body
    if (typeof data.item_id !== 'object') {
      data.item_id = [data.item_id]
    }
    try {
      getItemsByIdSync(data.item_id.map(id => parseInt(id)), (err, resultItems) => {
        if (err) {
          throw err
        } else {
          if (data.item_amount.length !== data.item_id.length) {
            return helper.response(res, false, 'item amount not equal to the item that have been chosen', 400)
          }
          if (resultItems.length === 0 || resultItems.length === undefined || resultItems.length === null) {
            return helper.response(res, false, `item (${data.item_id}) not found`, 400)
          }
          const code = codeTransaction(APP_TRANSACTION_PREFIX, 1)
          const total = resultItems.map((item, idx) => item.price * data.item_amount[idx]).reduce((acc, curr) => acc + curr)
          const tax = total * (10 / 100)
          const shippingCost = 10000
          const itemVariants = data.variant
          const paymentMethod = data.payment_method
          const userId = req.authUser.result.id
          getUserByIdSync(userId, (errId, resultId) => {
            if (errId) throw errId
            const { shippingAddress } = resultId[0].user_address
            const finalData = {
              code, total, tax, shipping_cost: shippingCost, variant: itemVariants, payment_method: paymentMethod, shipping_address: shippingAddress, user_id: userId
            }
            createTransaction(finalData, (errFinal, resultFinal) => {
              if (errFinal) throw errFinal
              resultItems.forEach((item, idx) => {
                const transactionData = {
                  name: item.name,
                  price: item.price,
                  amount: data.item_amount[idx],
                  variant: data.variant[idx],
                  item_id: item.id,
                  transaction_id: resultFinal.insertId
                }
                createItemTransaction(transactionData, (transactionErr) => {
                  if (transactionErr) throw transactionErr
                  console.log(`item ${item.id} has been bought`)
                })
              })
              return helper.response(res, true, resultFinal, 200)
            })
          })
        }
      })
    } catch (err) {
      console.log(err)
      return helper.response(res, false, 'Failed to make transactions', 400)
    }
  },

  getAllTransactions: async (req, res) => {
    const id = req.authUser.result.id
    console.log(id)
    try {
      const result = await getAllTransactions(id)
      return helper.response(res, true, result, 200)
    } catch (err) {
      console.log(err)
      return helper.response(res, false, 'No transactions yet', 401)
    }
  },

  deleteTransaction: async (req, res) => {
    const { id } = req.params
    try {
      const result = await deleteTransaction(id)
      return helper.response(res, true, result, 200)
    } catch (err) {
      console.log(err)
      return helper.response(res, false, 'an error occured', 500)
    }
  }

}
