"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var Joi = require('joi');

var express = require('express'),
    router = express.Router();

var query = require('../db');

var CustomError = require('../errors');

var AuthUtils = require('../utils/authentication');

var authenticated = require('../middlewares/authenticated');

function validateUser(user) {
  var schema = {
    username: Joi.string().min(3).required(),
    password: Joi.string().min(6).required(),
    name: Joi.string().required(),
    lastname: Joi.string().required()
  };

  var _Joi$validate = Joi.validate(user, schema),
      error = _Joi$validate.error;

  if (error) {
    throw new CustomError(400, error);
  }
}

router.get('/', authenticated.admin, /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee(req, res) {
    var queryString, result;
    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            queryString = "\n    SELECT id, username, name, lastname, CONCAT (name, ' ', lastname) as fullname\n    from users\n    where is_admin = 0\n  ";
            _context.next = 3;
            return query(queryString);

          case 3:
            result = _context.sent;
            res.send(result.rows);

          case 5:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}());
router.post('/', authenticated.admin, /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee2(req, res, next) {
    var _req$body, username, password, name, lastname, queryString, result, saltedPassword;

    return _regenerator.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            validateUser(req.body);
            _req$body = req.body, username = _req$body.username, password = _req$body.password, name = _req$body.name, lastname = _req$body.lastname;
            queryString = "\n      SELECT * from users where username = $1\n    ";
            _context2.next = 6;
            return query(queryString, [username]);

          case 6:
            result = _context2.sent;

            if (!result.rows.length) {
              _context2.next = 9;
              break;
            }

            return _context2.abrupt("return", next(new CustomError(400, 'Ya existe un usuario con ese nombre')));

          case 9:
            _context2.next = 11;
            return AuthUtils.hashPassword(password);

          case 11:
            saltedPassword = _context2.sent;
            _context2.next = 14;
            return query("\n      INSERT INTO users (username, password, name, lastname) VALUES ($1, $2, $3, $4)\n      ", [username, saltedPassword, name, lastname]);

          case 14:
            res.send();
            _context2.next = 20;
            break;

          case 17:
            _context2.prev = 17;
            _context2.t0 = _context2["catch"](0);
            next(_context2.t0);

          case 20:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[0, 17]]);
  }));

  return function (_x3, _x4, _x5) {
    return _ref2.apply(this, arguments);
  };
}());
router.delete('/:id', authenticated.admin, /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee3(req, res, next) {
    var id, deleteQuery;
    return _regenerator.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.prev = 0;
            id = req.params.id;
            deleteQuery = "\n      DELETE FROM users WHERE id = $1\n    ";
            _context3.next = 5;
            return query(deleteQuery, [id]);

          case 5:
            res.send();
            _context3.next = 11;
            break;

          case 8:
            _context3.prev = 8;
            _context3.t0 = _context3["catch"](0);
            next(_context3.t0);

          case 11:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[0, 8]]);
  }));

  return function (_x6, _x7, _x8) {
    return _ref3.apply(this, arguments);
  };
}());
module.exports = router;