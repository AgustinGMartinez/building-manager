const functions = require('firebase-functions')
const { Pool } = require('pg')
const CustomError = require('../errors')
const removeUndefined = require('../utils/arrays').removeUndefined

const connectionPool = new Pool({
  host: functions.config().db.host,
  user: functions.config().db.user,
  password: functions.config().db.password,
  database: functions.config().db.database,
  port: 5432,
  max: 20,
  ssl: true,
})

function query(query, parameters = null) {
  return new Promise((resolve, reject) => {
    connectionPool.query(query, removeUndefined(parameters), (err, result) => {
      if (err) {
        console.log(err)
        reject(new CustomError(500, 'DB query error: ' + err.message))
      }
      resolve(result)
    })
  })
}

module.exports = query
