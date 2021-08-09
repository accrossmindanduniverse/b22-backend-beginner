const helper = require('../helpers')
const bcrypt = require('bcrypt')
const authModels = require('../models/authModel')
const { validationResult } = require('express-validator')
const jwt = require('jsonwebtoken')
const { createNewToken } = require('../helpers/createToken')
const key = process.env

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
      console.log(err)
      return helper.response(res, false, 'failed to create account', 400)
    }
  },

  signIn: async function (req, res) {
    const { username, password } = req.body
    try {
      const result = await authModels.signIn(username)
      if (result.length < 1) return helper.response(res, false, 'username or password did not match to the record', 401)
      if (result[0].picture !== undefined || result[0].picture !== null) {
        result[0].picture = `${key.APP_URL}${result[0].picture}`
      }
      const user = result[0]
      console.log(user)
      const compare = await bcrypt.compare(password, user.password)
      if (compare) {
        const userData = jwt.sign({ id: user.id, role: user.role, picture: user.picture, name: user.name, user_address: user.user_address, first_name: user.first_name, last_name: user.last_name, phone_number: user.phone_number, username: user.username, password: user.password }, key.APP_KEY)
        if (userData) {
          const payload = jwt.verify(userData, key.APP_KEY)
          const RefreshToken = createNewToken(
            { ...payload },
            key.APP_KEY,
            '10h'
          )
          const data = {
            refreshToken: RefreshToken,
            userData: payload
          }
          console.log(payload)
          return helper.response(res, true, data, 200)
        }
      } else {
        return helper.response(res, false, 'email or password did not match to the record', 401)
      }
    } catch (err) {
      console.log(err)
      return helper.response(res, 'fail', 'Internal Server Error', 500)
    }
  }

}
