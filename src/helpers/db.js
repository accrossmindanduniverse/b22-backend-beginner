const mysql = require('mysql2')

const {
  MYSQL_HOST,
  MYSQL_USER,
  MYSQL_PASSWORD,
  MYSQL_DATABASE,
  JWT_SECRET_KEY,
  JWT_REFRESH_SECRET
} = process.env

const connection = {
  db: mysql.createConnection({
    host: MYSQL_HOST,
    user: MYSQL_USER,
    password: MYSQL_PASSWORD,
    database: MYSQL_DATABASE
  }),
  JWT: {
    secretKey: JWT_SECRET_KEY,
    refreshSecretKey: JWT_REFRESH_SECRET
  }
}

module.exports = connection
