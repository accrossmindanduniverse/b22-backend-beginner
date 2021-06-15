const helper = require('../helpers')
const itemModels = require('../models/itemModels')
const { postItemsToItemCategory } = require('../models/itemCategories-models')
const time = require('../helpers/time')
const env = process.env

module.exports = {

  getItemsData: async function (req, res) {
    const cond = req.query
    cond.search = cond.search || ''
    cond.sort = cond.sort || {}
    cond.sort.name = cond.sort.name || 'asc'
    cond.limit = parseInt(cond.limit) || 5
    cond.offset = parseInt(cond.offset) || 0
    cond.page = parseInt(cond.page) || 1
    cond.offset = (cond.page * cond.limit) - cond.limit
    const pageInfo = {}

    try {
      const result = await itemModels.getAllAndDetails(cond)
      result.map((e) => {
        if (e.picture !== null) {
          e.picture = `${env.APP_URL}${e.picture}`
        }
        return e
      })
      const resultCount = await itemModels.getItemsCount(cond)
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
      return helper.response(res, true, result, 200, pageInfo)
    } catch (err) {
      return helper.response(res, false, 'Item not found!', 400)
    }
  },

  getItemById: async function (req, res) {
    const { id } = req.params
    try {
      const result = await itemModels.getItemById(id)
      if (result[0].picture !== undefined || result[0].picture !== null) {
        result[0].picture = `${env.APP_URL}${result[0].picture}`
      }
      return helper.response(res, true, result, 200)
    } catch (err) {
      return helper.response(res, false, `item with (id: ${id}) not found`, 404)
    }
  },

  getPriceDetail: async function (req, res) {
    const priceDetail = req.query
    priceDetail.sort = priceDetail.sort || 'price'
    priceDetail.sort.price = priceDetail.sort.price || 'asc'
    try {
      const result = await itemModels.getPriceDetail(priceDetail)
      return helper.response(res, true, result, 200)
    } catch (err) {
      console.log(err)
      return helper.response(res, false, 'Internal Server Error!', 500)
    }
  },

  postItemData: async function (req, res) {
    const setData = req.body
    setData.picture = `${env.APP_UPLOAD_ROUTE}/${req.file.filename}`

    try {
      if (setData.price < 1) {
        return helper.response(res, false, 'Cannot input number below 1', 400)
      }
      const result = await itemModels.postItems(setData)
      if (typeof setData.category_id !== 'object') {
        setData.category_id = [setData.category_id]
      }
      await setData.category_id.forEach((categoryId) => {
        const categoryData = {
          item_id: result.insertId,
          category_id: categoryId
        }
        postItemsToItemCategory(categoryData, () => {
          console.log(`product ${result.insertId} has been created on category ${categoryId}!`)
        })
      })
      return helper.response(res, true, result, 200)
    } catch (error) {
      console.log(error)
      return helper.response(res, false, 'Internal Server Error!', 500)
    }
  },

  updateItem: async function (req, res) {
    const { id } = req.params
    const { name, price } = req.body
    console.log(req.authUser)
    const updateData = { name, price, updated_at: time.now() }
    try {
      const result = await itemModels.updateItemDatas(updateData, id)
      return helper.response(res, true, result, 200)
    } catch (err) {
      console.log(err)
      return helper.response(res, false, 'Internal Server Error!', 500)
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
      return helper.response(res, true, result, 200)
    } catch (err) {
      console.log(err)
      return helper.response(res, false, 'Internal Server Error!', 500)
    }
  },

  deleteItemById: async function (req, res) {
    const { id } = req.params
    try {
      const result = await itemModels.deleteItem(id)
      return helper.response(res, true, result, 200)
    } catch (err) {
      console.log(err)
      return helper.response(req, false, 'Internal Server Error!', 500)
    }
  }

}
