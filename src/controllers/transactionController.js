const helper = require('../helpers')
const { codeTransaction } = require('../helpers/transaction')
const { getItemsByIdSync } = require('../models/itemModels')
const { createItemTransaction } = require('../models/itemTransaction')
const { createTransaction } = require('../models/transactionModels')
const { getUserByIdSync } = require('../models/userModels')
const { APP_TRANSACTION_PREFIX } = process.env

module.exports = {

  createTransaction: function (req, res) {
    const data = req.body
    if (typeof data.item_id === 'string') {
      data.item_id = [data.item_id]
      data.item_amount = [data.item_amount]
    }
    console.log(data)
    getItemsByIdSync(data.item_id.map(id => parseInt(id)), (err, resultItems) => {
      if (err) throw err
      const code = codeTransaction(APP_TRANSACTION_PREFIX, 0)
      const total = resultItems.map((item, idx) => item.price * data.item_amount[idx]).reduce((acc, curr) => acc + curr)
      const tax = total * (10 / 100)
      const shippingCost = 10000
      const paymentMethod = data.payment_method
      const userId = req.authUser.result.id
      getUserByIdSync(userId, (errId, resultId) => {
        if (errId) throw errId
        const { shippingAddress } = resultId[0].user_address
        const finalData = {
          code, total, tax, shipping_cost: shippingCost, payment_method: paymentMethod, shipping_address: shippingAddress, user_id: userId
        }
        createTransaction(finalData, (errFinal, resultFinal) => {
          if (errFinal) throw errFinal
          resultItems.forEach((item, idx) => {
            console.log(item)
            const transactionData = {
              name: item.name,
              price: item.price,
              amount: data.item_amount[idx],
              item_id: item.id,
              transaction_id: resultFinal.insertId
            }
            createItemTransaction(transactionData, (err) => {
              if (err) throw err
              console.log(`item ${item.id} has been bought`)
            })
          })
          return helper.response(res, true, resultFinal, 200)
        })
      })
    })
  }

}
