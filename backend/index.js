import { config, https } from 'firebase-functions'
import admin from 'firebase-admin'
import http from 'http'
import url from 'url'
import express from 'express'
import cors from 'cors'

import mainRouter from './api'
import bodyParser from 'body-parser'
import CustomError from './errors'
import graphqlHTTP from 'express-graphql'
import schema from './graphql/schema/schema'

admin.initializeApp(config().firebase)
const app = express()

app.use(cors())

app.use(bodyParser.json())

app.use(mainRouter)

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
    error: err.message,
  })
})

app.use('/graphql', graphqlHTTP({ schema, graphiql: true }))

const api = https.onRequest(app)

// proxy implementation

const proxy = https.onRequest(function onRequest(client_req, client_res) {
  console.log('gonna fetch:', client_req.url.slice(1))

  const parsedUrl = url.parse('http://' + client_req.url.slice(1))
  console.log('hostname:', parsedUrl.hostname)
  console.log('path:', parsedUrl.pathname)

  const options = {
    hostname: parsedUrl.hostname,
    path: parsedUrl.pathname,
    method: client_req.method,
    headers: client_req.headers,
  }

  const proxy = http.request(options, function(res) {
    client_res.writeHead(res.statusCode, res.headers)
    res.pipe(client_res, {
      end: true,
    })
  })

  client_req.pipe(proxy, {
    end: true,
  })
})

export { proxy, api }
