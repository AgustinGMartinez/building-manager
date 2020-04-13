"use strict";

var functions = require('firebase-functions');

var _require = require('pg'),
    Pool = _require.Pool;

var CustomError = require('../errors');

var removeUndefined = require('../utils/arrays').removeUndefined;

var connectionPool = new Pool({
  host: functions.config().db.host,
  user: functions.config().db.user,
  password: functions.config().db.password,
  database: functions.config().db.database,
  port: 5432,
  max: 20,
  ssl: true
});

function query(query) {
  var parameters = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
  return new Promise(function (resolve, reject) {
    connectionPool.query(query, removeUndefined(parameters), function (err, result) {
      if (err) {
        console.log(err);
        reject(new CustomError(500, 'DB query error: ' + err.message));
      }

      resolve(result);
    });
  });
}

module.exports = query;
//# sourceMappingURL=index.js.map