const { check, checkSchema } = require('express-validator')
const { findUserByUsername } = require('../models/userModels')

const validator = [
  checkSchema({
    username: {
      isLength: {
        errorMessage: 'username must be 5 or greater characters long',
        options: {
          min: 5
        }
      }
    },
    password: {
      isLength: {
        errorMessage: 'password must be 8 or greater characters long',
        options: {
          min: 8
        }
      }
    }
  }),
  check('username')
    .exists()
    .custom(async (username) => {
      const result = await findUserByUsername(username)
      if (result[0].username === 1) {
        throw new Error('username unavailable, please input another one')
      }
    }),
  check('resend-password')
    .exists()
    .custom(async (matchPassword, { req }) => {
      if (req.body.password !== matchPassword) {
        throw new Error('password did not match')
      }
    })
]

module.exports = validator
