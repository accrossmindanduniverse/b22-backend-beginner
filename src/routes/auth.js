const express = require('express')
const router = express.Router()
const authController = require('../controllers/authController')
const validator = require('../middlewares/validator')

router.post('/signup', validator, authController.signUp)
router.post('/signin', authController.signIn)

module.exports = router
