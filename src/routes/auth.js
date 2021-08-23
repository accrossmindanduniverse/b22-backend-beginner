const express = require('express')
const router = express.Router()
const authController = require('../controllers/authController')
const authMiddleware = require('../middlewares/authMiddleware')
const validator = require('../middlewares/validator')

router.post('/signup', validator, authController.signUp)
router.post('/signin', authController.signIn)
router.post('/refresh-token', authMiddleware.verifyJwt, authController.refreshToken)
router.post('/fcm-token', authMiddleware.verifyJwt, authController.registerToken)

module.exports = router
