const helper = require('../helpers')
const itemModels = require('../models/item-models')
const time = require('../helpers/time')

module.exports = {

  getItemsData: async function (req, res) {
    const searchParams = Object.values(req.query)
    searchParams.search = searchParams.search || ''
    try {
      const result = await itemModels.getAllAndDetails(searchParams)
      return helper.response(res, 'success', result, 200)
    } catch (err) {
      return helper.response(res, 'fail', 'Item not found!', 404)
    }
  },

  getPriceDetail: async function (req, res) {
    const priceDetail = Object.values({
      expensive: req.query.expensive
    })
    try {
      const result = await itemModels.getPriceDetail(priceDetail)
      return helper.response(res, 'success', result, 200)
    } catch (err) {
      console.log(err)
      return helper.response(res, 'fail', 'Internal Server Error!', 500)
    }
  },

  postItemData: async function (req, res) {
    const setData = req.body
    try {
      const result = await itemModels.postItems(setData)
      console.log(res)
      return helper.response(res, 'success', result, 200)
    } catch (err) {
      console.log(err)
      return helper.response(res, 'fail', 'Internal Server Error!', 500)
    }
  },

  postItemsToItemCategory: async function (req, res) {
    const { id } = req.params
    try {
      const result = await itemModels.postItemsToItemCategory(id)
      return helper.response(res, 'success', result, 200)
    } catch (err) {
      console.log(err)
      return helper.response(res, 'fail', 'Internal Server Error!', 500)
    }
  },

  postCategoryItems: async function (req, res) {
    const setData = req.body
    try {
      const result = await itemModels.postCategoryItems(setData)
      return helper.response(res, 'success', result, 200)
    } catch (err) {
      console.log(err)
      return helper.response(res, 'fail', 'Internal Server Error!', 500)
    }
  },

  postItemsToItemVariant: async function (req, res) {
    const { id } = req.params
    try {
      const result = await itemModels.postItemsToItemVariant(id)
      return helper.response(res, 'success', result, 200)
    } catch (err) {
      console.log(err)
      return helper.response(res, 'fail', 'Internal Server Error!', 500)
    }
  },

  postItemsToVariantItem: async function (req, res) {
    const setData = req.body
    try {
      const result = await itemModels.postItemsToVariantItem(setData)
      return helper.response(res, 'success', result, 200)
    } catch (err) {
      console.log(err)
      return helper.response(res, 'fail', 'Internal Server Error!', 500)
    }
  },

  updateItem: async function (req, res) {
    const { id } = req.params
    const { name, price } = req.body

    const updateData = { name, price, updated_at: time.now() }
    try {
      const result = await itemModels.updateItemDatas(updateData, id)
      return helper.response(res, 'success', result, 200)
    } catch (err) {
      console.log(err)
      return helper.response(res, 'fail', 'Internal Server Error!', 500)
    }
  },

  updateItemPartial: async function (req, res) {
    const { id } = req.params
    const key = Object.keys(req.body)
    const lastColumn = key[0]
    const updateData = { id, [lastColumn]: req.body[lastColumn] }
    try {
      const result = await itemModels.updateItemPartial(updateData)
      console.log(updateData)
      return helper.response(res, 'success', result, 200)
    } catch (err) {
      console.log(err)
      return helper.response(res, 'fail', 'Internal Server Error!', 500)
    }
  },

  deleteItemById: async function (req, res) {
    const { id } = req.params
    try {
      const result = await itemModels.deleteItem(id)
      return helper.response(res, 'success', result, 200)
    } catch (err) {
      console.log(err)
      return helper.response(req, 'fail', 'Internal Server Error!', 500)
    }
  }

}
