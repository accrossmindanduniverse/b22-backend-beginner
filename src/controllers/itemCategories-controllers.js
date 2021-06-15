const helper = require('../helpers')
const itemCategoriesModels = require('../models/itemCategories-models')
const env = process.env

module.exports = {

  getItemsCategory: async function (req, res) {
    const searchParams = req.query
    searchParams.category_detail = searchParams.category_detail || ''
    try {
      const result = await itemCategoriesModels.getItemsByCategory(searchParams)
      result.map((e) => {
        if (e.picture !== null) {
          e.picture = `${env.APP_URL}${e.picture}`
        }
        return e
      })
      return helper.response(res, 'success', result, 200)
    } catch (err) {
      console.log(err)
      return helper.response(res, 'fail', 'item not found', 404)
    }
  },

  postCategoryItems: async function (req, res) {
    const setData = req.body
    try {
      const result = await itemCategoriesModels.postCategoryItems(setData)
      return helper.response(res, 'success', result, 200)
    } catch (err) {
      console.log(err)
      return helper.response(res, 'fail', 'Internal Server Error!', 500)
    }
  },

  postItemsToItemCategoryRaw: async function (req, res) {
    const { id } = req.params
    try {
      const result = await itemCategoriesModels.postItemsToItemCategoryRaw(id)
      return helper.response(res, 'success', result, 200)
    } catch (err) {
      console.log(err)
      return helper.response(res, 'fail', 'Internal Server Error!', 500)
    }
  }
}
