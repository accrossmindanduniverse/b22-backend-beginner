const express = require('express')
const router = express.Router()
const auth = require('../middlewares/authMiddleware')
const { download } = require('../controllers/download')

router.post('/:name', auth.verifyJwt, download)

module.exports = router
