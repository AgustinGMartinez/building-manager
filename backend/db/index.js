import { config } from 'firebase-functions'
import { Pool } from 'pg'
import CustomError from '../errors'
import { removeUndefined } from '../utils/arrays'

const connectionPool = new Pool({
  host: config().db.host,
  user: config().db.user,
  password: config().db.password,
  database: config().db.database,
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

export default query
