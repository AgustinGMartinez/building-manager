const functions = require('firebase-functions')
const mysql = require('mysql')
const CustomError = require('../errors')

const connectionPool = mysql.createPool({
  connectionLimit: 2,
  host: functions.config().db.host,
  user: functions.config().db.user,
  password: functions.config().db.password,
  database: functions.config().db.database,
})

function query(query, parameters = null) {
  return new Promise((resolve, reject) => {
    connectionPool.query(query, parameters, (err, result) => {
      if (err) {
        console.log(err)
        reject(new CustomError(500, 'DB query error'))
      }
      resolve(result)
    })
  })
}

module.exports = query
