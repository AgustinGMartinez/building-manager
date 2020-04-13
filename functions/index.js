"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.api = exports.proxy = void 0;

var _firebaseFunctions = require("firebase-functions");

var _firebaseAdmin = _interopRequireDefault(require("firebase-admin"));

var _http = _interopRequireDefault(require("http"));

var _url = _interopRequireDefault(require("url"));

var _express = _interopRequireDefault(require("express"));

var _cors = _interopRequireDefault(require("cors"));

var _api = _interopRequireDefault(require("./api"));

var _bodyParser = _interopRequireDefault(require("body-parser"));

var _errors = _interopRequireDefault(require("./errors"));

var _expressGraphql = _interopRequireDefault(require("express-graphql"));

_firebaseAdmin.default.initializeApp((0, _firebaseFunctions.config)().firebase);

var app = (0, _express.default)();
app.use((0, _cors.default)());
app.use(_bodyParser.default.json());
app.use(_api.default);
app.use(function (err, req, res, next) {
  if (err instanceof _errors.default) {
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

var api = _firebaseFunctions.https.onRequest(app); // proxy implementation


exports.api = api;

var proxy = _firebaseFunctions.https.onRequest(function onRequest(client_req, client_res) {
  console.log('gonna fetch:', client_req.url.slice(1));

  var parsedUrl = _url.default.parse('http://' + client_req.url.slice(1));

  console.log('hostname:', parsedUrl.hostname);
  console.log('path:', parsedUrl.pathname);
  var options = {
    hostname: parsedUrl.hostname,
    path: parsedUrl.pathname,
    method: client_req.method,
    headers: client_req.headers
  };

  var proxy = _http.default.request(options, function (res) {
    client_res.writeHead(res.statusCode, res.headers);
    res.pipe(client_res, {
      end: true
    });
  });

  client_req.pipe(proxy, {
    end: true
  });
});

exports.proxy = proxy;
//# sourceMappingURL=index.js.map