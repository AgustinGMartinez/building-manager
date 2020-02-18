const functions = require('firebase-functions')
const mysql = require('mysql')

function connect() {
  const connection = mysql.createConnection({
    host: functions.config().db.host,
    user: functions.config().db.user,
    password: functions.config().db.password,
    database: functions.config().db.database,
  })

  connection.connect(function(err) {
    if (err) {
      console.error('error connecting: ' + err.stack)
      return
    }

    console.log('connected as id ' + connection.threadId)
  })

  return connection
}

function query(query, parameters = null) {
  return new Promise((resolve, reject) => {
    const connection = connect()
    if (parameters) {
      connection.query(query, parameters, (err, result) => {
        if (err) {
          console.log(err)
          reject(new Error('DB query error'))
        }
        connection.end()
        resolve(result)
      })
    } else {
      connection.query(query, (err, result) => {
        if (err) {
          console.log(err)
          reject(new Error('DB query error'))
        }
        connection.end()
        resolve(result)
      })
    }
  })
}

module.exports = query
