const helper = require('../helpers')
const userModels = require('../models/userModels')
const bcrypt = require('bcrypt')
const env = process.env
const { validationResult } = require('express-validator')

module.exports = {
  getUserById: async function (req, res) {
    const cond = req.query
    cond.search = cond.search || ''
    try {
      const result = await userModels.getUserById(cond)
      if (result[0].picture !== undefined || result[0].picture !== null) {
        result[0].picture = `${env.APP_URL}/${result[0].picture}`
      }
      return helper.response(res, true, result, 200)
    } catch (err) {
      console.log(err)
      return helper.response(res, false, 'user not found', 400)
    }
  },

  getUserSinged: async (req, res) => {
    const { id } = req.authUser.result
    console.log(id)
    try {
      const result = await userModels.getUserSinged(id)
      return helper.response(res, true, result, 200)
    } catch (err) {
      console.log(err)
      return helper.response(res, false, 'An error occured', 500)
    }
  },

  updateUserInfo: async function (req, res) {
    const setData = req.body
    const id = req.authUser.result.id
    try {
      const getUserSigned = await userModels.getUserSinged(id)
      console.log(getUserSigned, 'test user')
      if (req.file) {
        setData.picture = `${env.APP_UPLOAD_ROUTE}/${req.file.filename}`
        console.log(true)
      } else {
        setData.picture = getUserSigned[0].picture
        console.log(false)
      }
      console.log(req.file, 'picture')
      const errValidate = validationResult(req)
      if (setData.username) {
        if (!errValidate.isEmpty()) {
          return helper.response(res, false, errValidate.errors[0].msg, 400)
        }
      }
      const cleanData = (setNewData) => {
        for (const newData in setNewData) {
          if (setNewData[newData] === undefined || setNewData[newData] === null || setNewData[newData] === '') {
            setNewData = setNewData[getUserSigned[0]]
          }
        }
        return setNewData
      }
      const result = await userModels.updateUserInfo(cleanData(setData), id)
      return helper.response(res, true, result, 200)
    } catch (err) {
      console.log(err)
      return helper.response(res, false, 'failed to update profile', 400)
    }
  },

  updatePassword: async function (req, res) {
    const setData = req.body
    const { id } = req.authUser.result
    const key = Object.keys(req.body)
    const lastColumn = key[0]
    setData.password = await bcrypt.hash(setData.password, await bcrypt.genSalt())
    const updateData = { id, [lastColumn]: setData[lastColumn] }
    console.log(updateData)
    try {
      console.log(typeof updateData.password, updateData.password)
      const passwordResult = await userModels.updatePassword(updateData)
      if (setData.password.length < 8) return helper.response(res, false, 'password must be 8 or greater characters long', 400)
      return helper.response(res, true, passwordResult, 200)
    } catch (err) {
      console.log(err)
      return helper.response(res, false, 'password did not match to the record', 400)
    }
  }
}
