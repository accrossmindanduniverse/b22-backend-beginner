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
    setData.password = await bcrypt.hash(setData.password, await bcrypt.genSalt())
    try {
      const errValidate = validationResult(req)
      req.params = setData.username
      if (!errValidate.isEmpty()) {
        return helper.response(res, false, errValidate.errors[0].msg, 400)
      }
      if (setData.role !== 'admin' && setData.role !== 'user') {
        return helper.response(res, false, 'role did not match to the record', 400)
      }
      const result = await authModels.signUp(setData)
      return helper.response(res, true, result, 200)
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
      const user = result[0]
      const compare = await bcrypt.compare(password, user.password)
      if (compare) {
        const token = jwt.sign({ id: user.id, role: user.role, username: user.username }, key.APP_KEY)
        console.log(token)
        if (token) {
          const payload = jwt.verify(token, key.APP_KEY)
          const RefreshToken = createNewToken(
            { ...payload },
            key.APP_KEY,
            '10h'
          )
          const data = {
            refreshToken: RefreshToken
          }
          return helper.response(res, true, data, 200)
        }
      } else {
        return helper.response(res, false, 'username or password did not match to the record', 401)
      }
    } catch (err) {
      console.log(err)
      return helper.response(res, 'fail', 'Internal Server Error', 500)
    }
  }

}
