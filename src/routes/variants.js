const express = require('express')
const router = express.Router()
const itemVariantControllers = require('../controllers/itemVariant-controllers')
const { verifyJwt } = require('../middlewares/authMiddleware')

// post
router.get('/', verifyJwt, itemVariantControllers.getItemVariant)
module.exports = router
