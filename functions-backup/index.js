const functions = require('firebase-functions');

const admin = require('firebase-admin');

admin.initializeApp(functions.config().firebase);

const express = require('express');

const cors = require('cors');

const app = express();

const api = require('./api');

const bodyParser = require('body-parser');

const CustomError = require('./errors');

const graphqlHTTP = require('express-graphql');

app.use(cors());
app.use(bodyParser.json());
app.use('/api', api);
app.use((err, req, res, next) => {
  if (err instanceof CustomError) {
    if (!err.message.isJoi) {
      return res.status(err.status).send({
        error: err.message
      });
    }

    return res.status(err.status).send({
      error: err.message.details[0].message
    });
  }

  return res.status(500).send({
    error: err.message
  });
});
exports.api = functions.https.onRequest(app); // proxy implementation

var http = require('http');

var url = require('url');

exports.proxy = functions.https.onRequest(function onRequest(client_req, client_res) {
  console.log('gonna fetch:', client_req.url.slice(1));
  const parsedUrl = url.parse('http://' + client_req.url.slice(1));
  console.log('hostname:', parsedUrl.hostname);
  console.log('path:', parsedUrl.pathname);
  var options = {
    hostname: parsedUrl.hostname,
    path: parsedUrl.pathname,
    method: client_req.method,
    headers: client_req.headers
  };
  var proxy = http.request(options, function (res) {
    client_res.writeHead(res.statusCode, res.headers);
    res.pipe(client_res, {
      end: true
    });
  });
  client_req.pipe(proxy, {
    end: true
  });
});