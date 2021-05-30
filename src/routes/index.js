const express = require('express')
const router = express.Router()
const itemsRoute = require('./items')

// prefix('/')
router.use('/items', itemsRoute)

module.exports = router
