const helper = require('../helpers')
const itemVariantsModels = require('../models/itemVariants-models')
const variantModels = require('../models/itemVariants-models')
const env = process.env

module.exports = {

  getItemVariant: async (req, res) => {
    const cond = req.query
    cond.variant = cond.variant || ''
    cond.limit = parseInt(cond.limit) || 5
    cond.offset = parseInt(cond.offset) || 0
    cond.page = parseInt(cond.page) || 1
    cond.offset = (cond.page * cond.limit) - cond.limit
    const pageInfo = {}

    try {
      const result = await variantModels.getItemVariants(cond)
      result.map((e) => {
        if (e.picture !== null) {
          e.picture = `${env.APP_URL}${e.picture}`
        }
        return e
      })
      const resultCount = await variantModels.getItemsCount(cond)
      console.log(resultCount)
      const totalData = resultCount[0].count
      const totalPage = Math.ceil(totalData / cond.limit)
      pageInfo.totalData = totalData
      pageInfo.currentPage = cond.page
      pageInfo.totalPage = totalPage
      pageInfo.limitPage = cond.limit
      pageInfo.nextPage = cond.page < totalPage ? `${env.APP_URL}/items?page=${cond.page + 1}` : null
      pageInfo.prevPage = cond.page <= totalPage || cond.page === 1 ? `${env.APP_URL}/items?page=${cond.page - 1}` : null
      if (pageInfo.prevPage.endsWith('0')) {
        pageInfo.prevPage = null
      }
      if (result.length === 0) {
        return helper.response(res, true, 'there is no item anymore', 200)
      }
      return helper.response(res, 'success', result, 200, pageInfo)
    } catch (err) {
      console.log(err)
      return helper.response(res, 'fail', 'variant not found', 404)
    }
  },

  getItemVariantsById: async function (req, res) {
    const { id } = req.params
    try {
      const result = await itemVariantsModels.getItemVariantsById(id)
      result.map((e) => {
        if (e.picture !== null) {
          e.picture = `${env.APP_URL}${e.picture}`
        }
        return e
      })
      return helper.response(res, true, result, 200)
    } catch (err) {
      console.log(err)
      return helper.response(res, false, 'item not found', 404)
    }
  },

  getSpecificItemsVariant: async function (req, res) {
    const { id } = req.params
    const cond = req.query
    cond.variant = cond.variant || ''
    try {
      const result = await itemVariantsModels.getSpecificItemsVariant(cond, id)
      result.map((e) => {
        if (e.picture !== null) {
          e.picture = `${env.APP_URL}${e.picture}`
        }
        return e
      })
      return helper.response(res, true, result, 200)
    } catch (err) {
      console.log(err)
      return helper.response(res, false, 'item not found', 404)
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
