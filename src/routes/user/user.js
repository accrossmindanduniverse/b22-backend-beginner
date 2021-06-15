const express = require('express')
const router = express.Router()
const userController = require('../../controllers/userController')
const authMiddleware = require('../../middlewares/authMiddleware')
const storage = require('../../helpers/upload')
const multer = require('multer')
const validator = require('../../helpers/validator')
const upload = multer({
  storage: storage
})

router.put('/update-profile', upload.single('picture'), validator, authMiddleware.verifyJwt, userController.updateUserInfo)
router.get('/', userController.getUserById)

module.exports = router
