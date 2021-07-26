const { checkSchema } = require('express-validator')
// const { findUserByUsername } = require('../models/userModels')
const errors = require('../helpers/errors')

const validator = [
  checkSchema({
    username: {
      isLength: {
        errorMessage: errors.username,
        options: {
          min: 5
        }
      }
    },
    password: {
      isLength: {
        errorMessage: errors.password,
        options: {
          min: 8
        }
      }
    }
  })
  // check('username')
  //   .exists()
  //   .custom(async (username) => {
  //     const result = await findUserByUsername(username)
  //     if (result[0].username === 1) {
  //       throw new Error('username unavailable, please input another one')
  //     }
  //   }),
  // check('resend_password')
  //   .exists()
  //   .custom(async (matchPassword, { req }) => {
  //     if (req.body.password !== matchPassword) {
  //       throw new Error('password did not match')
  //     }
  //   })
]

module.exports = validator
