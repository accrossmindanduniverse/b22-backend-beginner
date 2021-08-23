const mysql = require('mysql2')

const {
  MYSQL_HOST_DEV,
  MYSQL_USER_DEV,
  MYSQL_PASSWORD_DEV,
  MYSQL_DATABASE_DEV,
  JWT_SECRET_KEY_DEV,
  JWT_REFRESH_SECRET_DEV
} = process.env

const connection = {
  db: mysql.createConnection({
    host: MYSQL_HOST_DEV,
    user: MYSQL_USER_DEV,
    password: MYSQL_PASSWORD_DEV,
    database: MYSQL_DATABASE_DEV
  }),
  JWT: {
    secretKey: JWT_SECRET_KEY_DEV,
    refreshSecretKey: JWT_REFRESH_SECRET_DEV
  }
}

module.exports = connection
