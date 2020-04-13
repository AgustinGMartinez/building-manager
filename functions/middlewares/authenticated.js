"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var jwt = require('jsonwebtoken');

var CustomError = require('../errors');

var functions = require('firebase-functions');

var userTypes = {
  superadmin: {
    // only superadmins can bypass this validation
    validate: function validate(user) {
      return user.is_superadmin === 1;
    }
  },
  admin: {
    // admins and superadmins can bypass admin validation
    validate: function validate(user) {
      return user.is_admin === 1;
    }
  },
  user: {
    // any valid token can bypass user validation
    validate: function validate() {
      return true;
    }
  }
};

var authenticate = function authenticate(type) {
  return /*#__PURE__*/function () {
    var _ref = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee(req, res, next) {
      var token;
      return _regenerator.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.prev = 0;
              token = req.headers['authorization'].split(' ')[1];

              if (!token) {
                _context.next = 6;
                break;
              }

              jwt.verify(token, functions.config().jwt.secret, function (err, decoded) {
                if (err) {
                  throw new CustomError(401, 'Invalid token');
                } else {
                  if (!userTypes[type].validate(decoded)) {
                    throw new CustomError(401, 'Invalid token');
                  }

                  req.user = decoded;
                  next();
                }
              });
              _context.next = 7;
              break;

            case 6:
              throw new CustomError(401, 'Invalid token');

            case 7:
              _context.next = 14;
              break;

            case 9:
              _context.prev = 9;
              _context.t0 = _context["catch"](0);

              if (!(_context.t0 instanceof CustomError)) {
                _context.next = 13;
                break;
              }

              return _context.abrupt("return", next(_context.t0));

            case 13:
              next(new CustomError(401, _context.t0.message));

            case 14:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, null, [[0, 9]]);
    }));

    return function (_x, _x2, _x3) {
      return _ref.apply(this, arguments);
    };
  }();
};

var authenticated = {
  superadmin: authenticate('superadmin'),
  admin: authenticate('admin'),
  user: authenticate('user')
};
module.exports = authenticated;
//# sourceMappingURL=authenticated.js.map