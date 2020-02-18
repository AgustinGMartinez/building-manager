const functions = require('firebase-functions')
const admin = require('firebase-admin')
admin.initializeApp(functions.config().firebase)

const express = require('express')
const cors = require('cors')
const app = express()
const query = require('./mysql')
const api = require('./api')
const moment = require('moment')
const bodyParser = require('body-parser')
const CustomError = require('./errors')

app.use(cors())

app.use(bodyParser.json())

app.use(async (req, res, next) => {
  const queryString = `
    UPDATE prevent_delete
    SET last_update = '${moment()
      .utc(3)
      .toISOString()}'
  `
  query(queryString).then(() => console.log('updated last DB connection'))
  next()
})

app.use('/api', api)

app.use((err, req, res, next) => {
  if (err instanceof CustomError) {
    if (!err.message.isJoi) {
      return res.status(err.status).send({
        error: err.message,
      })
    }
    return res.status(err.status).send({
      error: err.message.details[0].message,
    })
  }
  return res.status(500).send({
    error: err,
  })
})

exports.api = functions.https.onRequest(app)
