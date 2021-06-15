const express = require('express')
const router = express.Router()
const itemCategoriesController = require('../controllers/itemCategories-controllers')
const { verifyJwt } = require('../middlewares/authMiddleware')

// get
router.get('/', verifyJwt, itemCategoriesController.getItemsCategory)

module.exports = router
