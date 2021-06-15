const express = require('express')
const router = express.Router()
const roleModels = require('../controllers/roleController')

router.post('/post', roleModels.createRole)

module.exports = router
