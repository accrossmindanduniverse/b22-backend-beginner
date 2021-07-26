const helper = require('../helpers')
const itemCategoriesModels = require('../models/itemCategories-models')
const env = process.env

module.exports = {

  getItemsCategory: async function (req, res) {
    const cond = req.query
    cond.search = cond.search || ''
    cond.sort = cond.sort || {}
    cond.sort.name = cond.sort.name || 'asc'
    cond.limit = parseInt(cond.limit) || 4
    cond.offset = parseInt(cond.offset) || 0
    cond.page = parseInt(cond.page) || 1
    cond.offset = (cond.page * cond.limit) - cond.limit
    const pageInfo = {}
    try {
      const result = await itemCategoriesModels.getItemsByCategory(cond)
      result.map((e) => {
        if (e.picture !== null) {
          e.picture = `${env.APP_URL}${e.picture}`
        }
        return e
      })
      const resultCount = await itemCategoriesModels.getItemsCount(cond)
      console.log('test', resultCount)
      const totalData = resultCount[0].count
      const totalPage = Math.ceil(totalData / cond.limit)
      pageInfo.totalData = totalData
      pageInfo.currentPage = cond.page
      pageInfo.totalPage = totalPage
      pageInfo.limitPage = cond.limit
      pageInfo.nextPage = cond.page < totalPage ? (cond.search ? `${env.APP_URL}/category?search=${cond.search}&page=${cond.page + 1}` : `${env.APP_URL}/category&page=${cond.page + 1}`) : null
      pageInfo.prevPage = cond.page <= totalPage || cond.page === 1 ? (cond.search ? `${env.APP_URL}/category?search=${cond.search}&page=${cond.page - 1}` : `${env.APP_URL}/category?page=${cond.page - 1}`) : null
      if (pageInfo.prevPage.endsWith('0')) {
        pageInfo.prevPage = null
      }
      if (result.length === 0) {
        return helper.response(res, true, 'Internal Server Error', 500)
      }
      return helper.response(res, 'success', result, 200, pageInfo)
    } catch (err) {
      console.log(err)
      return helper.response(res, 'fail', 'there is no item anymore', 200)
    }
  },

  getByCategory: async function (req, res) {
    try {
      const result = await itemCategoriesModels.getByCategory()
      return helper.response(res, true, result, 200)
    } catch (err) {
      console.log(err)
      return helper.response(res, false, 'categories not found', 404)
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
