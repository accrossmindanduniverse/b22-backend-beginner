const admin = require('firebase-admin')
const { APP_CREDENTIALS } = process.env
const serviceAccount = require('../config')[APP_CREDENTIALS]

const firebase = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
})

module.exports = { messaging: firebase.messaging() }
