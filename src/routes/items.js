const express = require('express')
const router = express.Router()
const itemsController = require('../controllers/item-controllers')
const authMiddleware = require('../middlewares/authMiddleware')

// endpoints

// gets
router.get('/', authMiddleware.verifyJwt, itemsController.getItemsData)
router.get('/price', authMiddleware.verifyJwt, itemsController.getPriceDetail)
router.get('/:id', authMiddleware.verifyJwt, itemsController.getItemById)

module.exports = router
