const helper = require('../helpers')
const variantModels = require('../models/itemVariants-models')

module.exports = {

  getItemVariant: async (req, res) => {
    const searchVariants = req.query
    searchVariants.variant = searchVariants.variant || ''

    try {
      const result = await variantModels.getItemVariants(searchVariants)
      return helper.response(res, 'success', result, 200)
    } catch (err) {
      console.log(err)
      return helper.response(res, 'fail', 'variant not found', 404)
    }
  },

  postItemsToItemVariant: async function (req, res) {
    const { id } = req.params
    const setData = { additionalPrice: req.body.additional_price, variantId: req.body.variant_id }
    try {
      const result = await variantModels.postItemsToItemVariant(setData, id)
      return helper.response(res, 'success', result, 200)
    } catch (err) {
      console.log(err)
      return helper.response(res, 'fail', 'Internal Server Error!', 500)
    }
  },

  postItemsToVariantItem: async function (req, res) {
    const setData = req.body
    try {
      const result = await variantModels.postItemsToVariantItem(setData)
      return helper.response(res, 'success', result, 200)
    } catch (err) {
      console.log(err)
      return helper.response(res, 'fail', 'Internal Server Error!', 500)
    }
  }
}
