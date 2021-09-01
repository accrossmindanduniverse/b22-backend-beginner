const multer = require('multer')
const { response } = require('../helpers/index')
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
}).single('file')

const uploadFilter = (req, res, next) => {
  console.log(req, 'test mmulter first')
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      return response(res, false, err.message, 400)
    } else if (err) {
      return response(res, false, err.message, 500)
    }
    console.log(req, 'test multer second')
    next()
  })
}

module.exports = uploadFilter
