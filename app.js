require('dotenv').config()
const express = require('express')
const app = express()
const env = process.env
const port = env.PORT || 8000
const { db } = require('./src/helpers/db')
const routes = require('./src/routes')
const bodyParser = require('body-parser')
const server = require('https').createServer(app)
const io = require('socket.io')(server, {
  cors: {
    origin: 'https://relaxed-swartz-622ed9.netlify.app/'
  }
})
const cors = require('cors')
const socket = require('./src/middlewares/socket')

io.on('connection', () => {
  console.log('socket connection is exists')
})

app.use(cors())

app.use(socket(io))

app.use(bodyParser.urlencoded({
  extended: false
}))
app.use(bodyParser.json())

app.use('/', routes)

// picture
app.use(env.APP_UPLOAD_ROUTE, express.static(env.APP_UPLOAD_PATH))

app.get('/files/:file', function (req, res) {
  return res.download('./assets/files/' + req.params.file)
})

// file
app.use(env.APP_FILE_ROUTE, express.static(env.APP_UPLOAD_FILE_PATH))

server.listen(port, () => {
  console.log(`App running on port ${port}`)
})

db.connect(function (err) {
  if (err) {
    throw err
  } else {
    console.log('Database has connected')
  }
})
