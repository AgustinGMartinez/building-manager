"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var jwt = require('jsonwebtoken');

var bcrypt = require('bcrypt');

var functions = require('firebase-functions');

var generateJwt = function generateJwt(payload) {
  return jwt.sign(payload, functions.config().jwt.secret);
};

var generateHash = function generateHash() {
  return bcrypt.genSalt(5);
};

var hashPassword = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee(password) {
    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            return _context.abrupt("return", bcrypt.hash(password, 10));

          case 1:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function hashPassword(_x) {
    return _ref.apply(this, arguments);
  };
}();

var comparePassword = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee2(password, hash) {
    return _regenerator.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            return _context2.abrupt("return", bcrypt.compare(password, hash));

          case 1:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function comparePassword(_x2, _x3) {
    return _ref2.apply(this, arguments);
  };
}();

module.exports = {
  generateJwt: generateJwt,
  hashPassword: hashPassword,
  comparePassword: comparePassword,
  generateHash: generateHash
};
//# sourceMappingURL=authentication.js.map