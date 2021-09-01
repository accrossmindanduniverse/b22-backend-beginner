const admin = require('firebase-admin')
const serviceAccount = require('../config')['coffeeshop-dc827-firebase-adminsdk-lh8zn-9053e2c0e4']

const firebase = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
})

module.exports = { messaging: firebase.messaging() }
