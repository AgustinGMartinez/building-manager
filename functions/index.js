"use strict";

var functions = require('firebase-functions');

var admin = require('firebase-admin');

admin.initializeApp(functions.config().firebase);

var express = require('express');

var cors = require('cors');

var app = express();

var api = require('./api');

var bodyParser = require('body-parser');

var CustomError = require('./errors');
/* const graphqlHTTP = require('express-graphql') */


app.use(cors());
app.use(bodyParser.json());
app.use(api);
app.use(function (err, req, res, next) {
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
  var parsedUrl = url.parse('http://' + client_req.url.slice(1));
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