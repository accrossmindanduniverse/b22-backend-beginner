const express = require('express')
const router = express.Router()
const userController = require('../../controllers/userController')
const authMiddleware = require('../../middlewares/authMiddleware')
const upload = require('../../middlewares/upload')

router.get('/', userController.getUserById)
router.get('/signed', authMiddleware.verifyJwt, userController.getUserSigned)
router.put('/update-profile', authMiddleware.verifyJwt, upload, userController.updateUserInfo)
router.post('/confirm-password', authMiddleware.verifyJwt, userController.confirmPassword)
router.patch('/update-password', authMiddleware.verifyJwt, userController.updatePassword)

module.exports = router
