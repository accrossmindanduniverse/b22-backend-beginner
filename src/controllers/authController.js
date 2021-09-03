const helper = require('../helpers')
const bcrypt = require('bcrypt')
const authModels = require('../models/authModel')
const { validationResult } = require('express-validator')
const jwt = require('jsonwebtoken')
const { createNewToken } = require('../helpers/createToken')
const { JWT } = require('../helpers/db')
const { createFCMToken, findToken } = require('../models/fcmToken')

module.exports = {

  signUp: async function (req, res) {
    const setData = req.body
    setData.role = setData.role ? 'admin' : 'user'
    setData.password = await bcrypt.hash(setData.password, await bcrypt.genSalt())
    try {
      const errValidate = validationResult(req)
      if (!errValidate.isEmpty()) {
        return helper.response(res, false, errValidate.errors[0].msg, 400)
      }
      const result = await authModels.signUp(setData)
      return helper.response(res, true, [result, setData], 200)
    } catch (err) {
      // istanbul ignore next
      console.log(err)
      // istanbul ignore next
      return helper.response(res, false, 'failed to create account', 400)
    }
  },

  signIn: async (req, res) => {
    const { username, password } = req.body
    try {
      const result = await authModels.signIn(username)
      if (result.length < 1) return helper.response(res, false, 'email or password did not match to the record', 401)
      const user = result[0]
      const compare = await bcrypt.compare(password, user.password)
      if (compare) {
        const token = jwt.sign({ ...result }, JWT.secretKey, {
          expiresIn: '30s'
        })
        const refreshToken = jwt.sign({ ...result }, JWT.refreshSecretKey, {
          expiresIn: '1m'
        })
        const newResult = { refreshToken, token, id: user.id, role: user.role, picture: user.picture, name: user.name, user_address: user.user_address, first_name: user.first_name, last_name: user.last_name, phone_number: user.phone_number, username: user.username, password: user.password }
        return helper.response(res, true, newResult, 200)
      } else {
        return helper.response(res, false, 'Email or password did not match to the record', 400)
      }
    } catch (err) {
      // istanbul ignore next
      console.log(err)
      // istanbul ignore next
      return helper.response(res, false, 'An error occured', 500)
    }
  },

  refreshToken: async (req, res) => {
    const { refreshToken } = req.body
    try {
      const payload = jwt.verify(refreshToken, JWT.refreshSecretKey)
      const token = createNewToken(
        { ...payload },
        JWT.secretKey,
        '24h'
      )
      const result = {
        token: token
      }
      return helper.response(res, true, result, 200)
    } catch (err) {
      // istanbul ignore next
      console.log(err)
      // istanbul ignore next
      return helper.response(res, false, 'An error occured', 500)
    }
  },

  // istanbul ignore next
  registerToken: async (req, res) => {
    // istanbul ignore next
    const user = req.authUser.result[0]
    const setData = req.body
    setData.user_id = user.id

    try {
      const find = await findToken(user.id)
      if (find.length < 1) {
        const result = await createFCMToken(setData)
        return helper.response(res, true, result, 200)
      }
      return helper.response(res, true, find, 200)
    } catch (err) {
      console.log(err)
      return helper.response(res, false, 'An error occured', 500)
    }
  }

}
