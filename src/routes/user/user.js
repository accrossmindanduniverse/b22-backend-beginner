const express = require('express')
const router = express.Router()
const userController = require('../../controllers/userController')
const authMiddleware = require('../../middlewares/authMiddleware')
// const upload = require('../../middlewares/upload')

const multer = require('multer')
// const { response } = require('../helpers/index')
const path = require('path')

const maxSize = 1024 * 1024 * 2

const storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, path.join(process.cwd(), 'assets', 'pictures'))
  },
  filename: function (_req, file, cb) {
    const ext = file.originalname.split('.')[1]
    const date = new Date()
    cb(null, `${date.getTime()}.${ext}`)
  }
})

const upload = multer({
  storage: storage,
  limits: { fileSize: maxSize }
})

// const uploadFilter = (req, res, next) => {
//   console.log(req, 'test mmulter first')
//   upload(req, res, function (err) {
//     if (err instanceof multer.MulterError) {
//       return response(res, false, err.message, 400)
//     } else if (err) {
//       return response(res, false, err.message, 500)
//     }
//     console.log(req, 'test multer second')
//   })
//   next()
// }

router.get('/', authMiddleware.verifyJwt, userController.getUserById)
router.get('/signed', authMiddleware.verifyJwt, userController.getUserSigned)
router.put('/update-profile', authMiddleware.verifyJwt, upload.single('picture'), userController.updateUserInfo)
router.put('/upload-picture', authMiddleware.verifyJwt, upload.single('picture'), userController.uploadPicture)
router.post('/confirm-password', authMiddleware.verifyJwt, userController.confirmPassword)
router.patch('/update-password', authMiddleware.verifyJwt, userController.updatePassword)

module.exports = router
