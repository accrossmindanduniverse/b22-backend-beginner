const helper = require('../helpers')
const userModels = require('../models/userModels')
const { APP_UPLOAD_ROUTE } = process.env
const bcrypt = require('bcrypt')
const { validationResult } = require('express-validator')

module.exports = {
  getUserById: async function (req, res) {
    const cond = req.query
    cond.search = cond.search || ''
    try {
      const result = await userModels.getUserById(cond)
      return helper.response(res, true, result, 200)
    } catch (err) {
      console.log(err)
      return helper.response(res, false, 'user not found', 400)
    }
  },

  updateUserInfo: async function (req, res) {
    const setData = req.body
    const id = req.authUser.result.id
    setData.password = await bcrypt.hash(setData.password, await bcrypt.genSalt())
    try {
      const errValidate = validationResult(req)
      console.log(errValidate)
      if (!errValidate.isEmpty()) {
        return helper.response(res, false, errValidate.errors[0].msg, 400)
      }
      if (setData.picture) {
        setData.picture = `${APP_UPLOAD_ROUTE}/${req.file.filename}`
      }
      if (setData['resend-password']) {
        delete setData['resend-password']
      }
      const result = await userModels.updateUserInfo(setData, id)
      return helper.response(res, true, result, 200)
    } catch (err) {
      console.log(err)
      return helper.response(res, false, 'failed to update profile', 400)
    }
  }
}
