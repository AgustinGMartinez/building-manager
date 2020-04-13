"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var Joi = require('joi');

var express = require('express'),
    router = express.Router();

var query = require('../db');

var CustomError = require('../errors');

var AuthUtils = require('../utils/authentication');

function validateLogin(auth) {
  var schema = {
    username: Joi.string().required(),
    password: Joi.string().required()
  };

  var _Joi$validate = Joi.validate(auth, schema),
      error = _Joi$validate.error;

  if (error) {
    throw new CustomError(400, error);
  }
}

router.post('/login', /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee(req, res, next) {
    var _req$body, username, password, getUserQuery, user, isAuth, token;

    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            validateLogin(req.body);
            _req$body = req.body, username = _req$body.username, password = _req$body.password;
            getUserQuery = "\n      select * from users where username = $1 limit 1\n    ";
            _context.next = 6;
            return query(getUserQuery, [username]);

          case 6:
            user = _context.sent.rows[0];

            if (user) {
              _context.next = 9;
              break;
            }

            throw new CustomError(401, 'Usuario o contraseña inválidos.');

          case 9:
            _context.next = 11;
            return AuthUtils.comparePassword(password, user.password);

          case 11:
            isAuth = _context.sent;

            if (isAuth) {
              _context.next = 14;
              break;
            }

            throw new CustomError(401, 'Usuario o contraseña inválidos.');

          case 14:
            token = AuthUtils.generateJwt(_objectSpread({}, user));
            user.password = undefined;
            res.send({
              token: token,
              user: user
            });
            _context.next = 22;
            break;

          case 19:
            _context.prev = 19;
            _context.t0 = _context["catch"](0);
            next(_context.t0);

          case 22:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 19]]);
  }));

  return function (_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}());
module.exports = router;
//# sourceMappingURL=auth.js.map