const fs = require('fs')

exports.download = (req, res, _next) => {
  console.log('fileController.download: started')
  const path = req.body.path
  const file = fs.createReadStream(path)
  const filename = (new Date()).toISOString()
  res.setHeader('Content-Disposition', 'attachment: filename="' + filename + '"')
  file.pipe(res)
}
