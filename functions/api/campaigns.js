"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var Joi = require('joi');

var express = require('express'),
    router = express.Router();

var query = require('../db');

var CustomError = require('../errors');

var authenticated = require('../middlewares/authenticated');

function validateCampaign(campaigns) {
  var schema = {
    name: Joi.string().required()
  };

  var _Joi$validate = Joi.validate(campaigns, schema),
      error = _Joi$validate.error;

  if (error) {
    throw new CustomError(400, error);
  }
}

router.get('/', authenticated.admin, /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee(req, res) {
    var campaignsQuery, campaigns;
    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            campaignsQuery = "\n  SELECT *\n  FROM campaigns\n  ";
            _context.next = 3;
            return query(campaignsQuery);

          case 3:
            campaigns = _context.sent;
            res.send(campaigns.rows);

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
    var name, checkUniqueNameQuery, result;
    return _regenerator.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            validateCampaign(req.body);
            name = req.body.name;
            checkUniqueNameQuery = "\n      SELECT * from campaigns where name = $1\n    ";
            _context2.next = 6;
            return query(checkUniqueNameQuery, [name]);

          case 6:
            result = _context2.sent;

            if (!result.rows.length) {
              _context2.next = 9;
              break;
            }

            return _context2.abrupt("return", next(new CustomError(400, 'Ya existe una campaña con ese nombre')));

          case 9:
            _context2.next = 11;
            return query("\n      INSERT INTO campaigns (name) VALUES ($1)\n      ", [name]);

          case 11:
            res.send();
            _context2.next = 17;
            break;

          case 14:
            _context2.prev = 14;
            _context2.t0 = _context2["catch"](0);
            next(_context2.t0);

          case 17:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[0, 14]]);
  }));

  return function (_x3, _x4, _x5) {
    return _ref2.apply(this, arguments);
  };
}());
router.delete('/:id', authenticated.admin, /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee3(req, res, next) {
    var id;
    return _regenerator.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.prev = 0;
            id = req.params.id;
            _context3.next = 4;
            return query("\n      DELETE FROM campaigns WHERE id = $1\n      ", [id]);

          case 4:
            res.send();
            _context3.next = 10;
            break;

          case 7:
            _context3.prev = 7;
            _context3.t0 = _context3["catch"](0);
            next(_context3.t0);

          case 10:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[0, 7]]);
  }));

  return function (_x6, _x7, _x8) {
    return _ref3.apply(this, arguments);
  };
}());
module.exports = router;