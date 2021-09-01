const formidable = require('formidable')
const { response } = require('../helpers')
const fs = require('fs')
const path = require('path')

const upload = (req, res, next) => {
  const maxSize = 2 * 1024 * 1024

  // const form = new formidable.IncomingForm()
  const form = formidable({ multiples: true, uploadDir: path.join(process.cwd(), 'assets', 'pictures'), maxFileSize: maxSize, keepExtensions: true })

  form.parse(req, (err, fields, files) => {
    console.log(files, 'file upload')
    // const ext = files.picture.split('.')[1]
    // const date = new Date()
    // const newPath = path.join(process.cwd(), 'assets', 'pictures') + '/' +
    //  `${date.getTime()}.${ext}`
    if (!err) {
      fs.writeFile((err2, cb) => {
        if (!err2) return response(res, false, err2, 500)
        // cb(newPath)
        return response(res, true, res.send, 200)
      })
      next()
    }
  })
  // return response(res, true, form, 200)
}

module.exports = upload
