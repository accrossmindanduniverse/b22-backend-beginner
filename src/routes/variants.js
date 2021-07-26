const express = require('express')
const router = express.Router()
const itemVariantControllers = require('../controllers/itemVariant-controllers')
const { verifyJwt } = require('../middlewares/authMiddleware')

// post
router.get('/', verifyJwt, itemVariantControllers.getItemVariant)
router.get('/detail/:id', itemVariantControllers.getSpecificItemsVariant)
router.get('/:id', itemVariantControllers.getItemVariantsById)
module.exports = router
