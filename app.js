require('dotenv').config()
const express = require('express')
const app = express()
const env = process.env
const port = 3001
const connection = require('./src/helpers/db')
const routes = require('./src/routes')
const bodyParser = require('body-parser')
const cors = require('cors')

app.use(cors())

app.use(bodyParser.urlencoded({
  extended: false
}))
app.use(bodyParser.json())

app.use('/', routes)
// app.use('/upload', express.static('./assets'))
app.use(env.APP_UPLOAD_ROUTE, express.static(env.APP_UPLOAD_PATH))

app.listen(port, () => {
  console.log(`App running on port ${port}`)
})

connection.connect(function (err) {
  if (err) {
    throw err
  } else {
    console.log('Database has connected')
  }
})
