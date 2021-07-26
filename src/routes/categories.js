const express = require('express')
const router = express.Router()
const itemCategoriesController = require('../controllers/itemCategories-controllers')
// const { verifyJwt } = require('../middlewares/authMiddleware')

// get
router.get('/', itemCategoriesController.getItemsCategory)
router.get('/categories', itemCategoriesController.getByCategory)

module.exports = router
