const express = require('express')
const router = express.Router()
const userController = require('../../controllers/userController')
const authMiddleware = require('../../middlewares/authMiddleware')
const upload = require('../../middlewares/upload')
const validator = require('../../middlewares/validator')

router.get('/', userController.getUserById)
router.get('/singed', authMiddleware.verifyJwt, userController.getUserSinged)
router.put('/update-profile', authMiddleware.verifyJwt, upload, userController.updateUserInfo)
router.patch('/update-password', validator, authMiddleware.verifyJwt, userController.updatePassword)

module.exports = router
