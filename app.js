require('dotenv').config()
const express = require('express')
const app = express()
const port = 3001
const connection = require('./src/helpers/db')
const routes = require('./src/routes')
const bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({
  extended: true
}))
app.use(bodyParser.json())

app.use('/', routes)

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
