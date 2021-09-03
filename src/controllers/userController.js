const helper = require('../helpers')
const userModels = require('../models/userModels')
const bcrypt = require('bcrypt')
const env = process.env
const path = './assets/pictures'
const fs = require('fs')
const { validationResult } = require('express-validator')

module.exports = {
  getUserById: async function (req, res) {
    const cond = req.query
    cond.search = cond.search || ''
    try {
      const result = await userModels.getUserById(cond)
      if (result.length > 0) {
        if (result[0]?.picture !== undefined || result[0]?.picture !== null) {
          result[0].picture = `${result[0].picture}`
        }
      }
      return helper.response(res, true, result, 200)
    } catch (err) {
      // istanbul ignore next
      console.log(err)
      // istanbul ignore next
      return helper.response(res, false, 'user not found', 400)
    }
  },

  getUserSigned: async (req, res) => {
    const { id } = req.authUser.result[0]
    try {
      const result = await userModels.getUserSigned(id)
      return helper.response(res, true, result, 200)
    } catch (err) {
      // istanbul ignore next
      console.log(err)
      // istanbul ignore next
      return helper.response(res, false, 'An error occured', 500)
    }
  },

  updateUserInfo: async function (req, res) {
    const setData = req.body
    const { id } = req.authUser.result[0]
    try {
      const getUserSigned = await userModels.getUserSignedForUpdate(id)
      const checkAvailableUser = await userModels.findUserByUsername(setData.username)
      if (getUserSigned[0].username !== setData.username && checkAvailableUser[0].username === 1) {
        return helper.response(res, false, 'email unavailable', 400)
      }
      if (req.file) {
        // istanbul ignore next
        setData.picture = `${env.APP_UPLOAD_ROUTE}/${req.file.filename}`
      } else {
        // istanbul ignore next
        setData.picture = getUserSigned[0].picture
      }
      if (req.file !== undefined && getUserSigned[0].picture !== null) {
        // istanbul ignore next
        const slicedPicture = getUserSigned[0].picture.slice('7')
        fs.unlinkSync(`${path}${slicedPicture}`, (err, pictureData) => {
          // istanbul ignore next
          if (!err) {
            // istanbul ignore next
            return helper.response(res, true, pictureData, 200)
          }
        })
      }
      const errValidate = validationResult(req)
      if (setData.username) {
        // istanbul ignore next
        if (!errValidate.isEmpty()) {
          // istanbul ignore next
          return helper.response(res, false, errValidate.errors[0].msg, 400)
        }
      }
      console.log(setData)
      const result = await userModels.updateUserInfo(setData, id)
      return helper.response(res, true, result, 200)
    } catch (err) {
      // istanbul ignore next
      console.log(err)
      // istanbul ignore next
      return helper.response(res, false, 'failed to update profile', 400)
    }
  },

  // uploadPicture: async (req, res) => {
  //   const { id } = req.authUser.result[0]
  //   const setData = req.body
  //   try {
  //     const getUserSigned = await userModels.getUserSignedForUploadPicture(id)
  //     if (req.file) {
  //       setData.picture = `${env.APP_UPLOAD_ROUTE}/${req.file.filename}`
  //     } else {
  //       setData.picture = getUserSigned[0].picture
  //     }
  //     if (req.file !== undefined && getUserSigned[0].picture !== null) {
  //       const slicedPicture = getUserSigned[0].picture.slice('7')
  //       fs.unlinkSync(`${path}${slicedPicture}`, (err, pictureData) => {
  //         if (!err) return helper.response(res, true, pictureData, 200)
  //       })
  //     }
  //     const result = await userModels.uploadPicture(setData, id)
  //     return helper.response(res, true, result, 200)
  //   } catch (err) {
  //     // istanbul ignore next
  // console.log(err)
  // istanbul ignore next
  //     return helper.response(res, false, 'An error occured', 500)
  //   }
  // },

  confirmPassword: async (req, res) => {
    const { password } = req.body
    try {
      const { id } = req.authUser.result[0]
      const result = await userModels.confirmPassword(id)
      const compare = await bcrypt.compare(password, result[0].password)
      console.log(compare, 'result')
      if (!compare) return helper.response(res, false, 'Password did not match to the record', 400)
      return helper.response(res, true, compare, 200)
    } catch (err) {
      // istanbul ignore next
      console.log(err)
      // istanbul ignore next
      return helper.response(res, false, 'An error occured', 500)
    }
  },

  updatePassword: async function (req, res) {
    const setData = req.body
    const { id } = req.authUser.result[0]
    const key = Object.keys(req.body)
    const lastColumn = key[0]
    if (setData.password.length < 8) return helper.response(res, false, 'password must be 8 or greater characters long', 400)
    if (setData.resendPassword !== setData.password) return helper.response(res, false, 'password did not match', 400)
    setData.password = await bcrypt.hash(setData.password, await bcrypt.genSalt())
    const updateData = { id, [lastColumn]: setData[lastColumn] }
    console.log(updateData)
    try {
      const passwordResult = await userModels.updatePassword(updateData)
      return helper.response(res, true, passwordResult, 200)
    } catch (err) {
      // istanbul ignore next
      console.log(err)
      // istanbul ignore next
      return helper.response(res, false, 'password did not match to the record', 400)
    }
  }
}
