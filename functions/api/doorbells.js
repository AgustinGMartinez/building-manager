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

var createQueryValues = require('../utils/db').createQueryValues;

function validateUpsert(doorbells) {
  var schema = {
    buildingId: Joi.number().required(),
    doorbells: Joi.array().items(Joi.object({
      floor: Joi.number(),
      identifier: Joi.string()
    })).required()
  };

  var _Joi$validate = Joi.validate(doorbells, schema),
      error = _Joi$validate.error;

  if (error) {
    throw new CustomError(400, error);
  }
}

router.post('/', authenticated.admin, /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee(req, res, next) {
    var _req$body, buildingId, doorbells, setAllDeletedQuery, upsertQueryData, partialUpsertQuery, upsertQuery;

    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            validateUpsert(req.body);
            _req$body = req.body, buildingId = _req$body.buildingId, doorbells = _req$body.doorbells;
            setAllDeletedQuery = "\n      UPDATE doorbells SET deleted = 1 where building_id = $1\n    ";
            _context.next = 6;
            return query(setAllDeletedQuery, [buildingId]);

          case 6:
            upsertQueryData = doorbells.reduce(function (acc, _ref2) {
              var floor = _ref2.floor,
                  identifier = _ref2.identifier;
              return acc.concat(buildingId, floor, identifier, "".concat(buildingId).concat(floor).concat(identifier));
            }, []);
            partialUpsertQuery = "\n      INSERT INTO doorbells (building_id, floor, identifier, special_id)\n      VALUES ?\n      ON CONFLICT (special_id) DO UPDATE\n        SET deleted = 0\n    ";
            upsertQuery = createQueryValues(partialUpsertQuery, upsertQueryData, 4);
            _context.next = 11;
            return query(upsertQuery, upsertQueryData);

          case 11:
            res.send();
            _context.next = 17;
            break;

          case 14:
            _context.prev = 14;
            _context.t0 = _context["catch"](0);
            next(_context.t0);

          case 17:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 14]]);
  }));

  return function (_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}());
module.exports = router;