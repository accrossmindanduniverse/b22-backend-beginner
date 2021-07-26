const express = require('express')
const router = express.Router()
const itemsController = require('../controllers/item-controllers')
const authMiddleware = require('../middlewares/authMiddleware')

// endpoints

// gets
router.get('/', itemsController.getItemsData)
router.get('/price', authMiddleware.verifyJwt, itemsController.getPriceDetail)
router.get('/:id', itemsController.getItemById)

module.exports = router
