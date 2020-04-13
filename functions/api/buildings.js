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

function validateBuilding(building) {
  var schema = {
    territory: Joi.number().required(),
    street: Joi.string().required(),
    house_number: Joi.string().required(),
    admin_note: Joi.string().optional().allow(''),
    lat: Joi.number().required(),
    lng: Joi.number().required()
  };

  var _Joi$validate = Joi.validate(building, schema),
      error = _Joi$validate.error;

  if (error) {
    throw new CustomError(400, error);
  }
}

router.get('/', authenticated.admin, /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee(req, res) {
    var buildingsQuery, doorbellsQuery, buildings, doorbells;
    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            buildingsQuery = "\n    SELECT b.*, coalesce(d.doorbell_count, 0) AS doorbell_count\n    FROM buildings b\n    LEFT JOIN (\n      SELECT building_id, count(*) as doorbell_count\n        FROM doorbells\n        WHERE deleted = 0\n        GROUP BY building_id\n    ) as d\n    ON b.id = d.building_id\n    ";
            doorbellsQuery = "\n      SELECT *\n      FROM doorbells\n      WHERE deleted = 0\n    ";
            _context.next = 5;
            return query(buildingsQuery);

          case 5:
            buildings = _context.sent;
            _context.next = 8;
            return query(doorbellsQuery);

          case 8:
            doorbells = _context.sent;
            buildings.rows.forEach(function (building) {
              var bId = building.id;
              var bDoorbells = [];
              doorbells.rows.forEach(function (doorbell) {
                if (doorbell.building_id === bId) {
                  bDoorbells.push(doorbell);
                }
              });
              building.doorbells = bDoorbells;
            });
            res.send(buildings.rows);
            _context.next = 16;
            break;

          case 13:
            _context.prev = 13;
            _context.t0 = _context["catch"](0);
            next(_context.t0);

          case 16:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 13]]);
  }));

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}());
router.get('/:id/doorbells', authenticated.admin, /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee2(req, res, next) {
    var buildingId, doorbellsQuery, doorbells;
    return _regenerator.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            buildingId = req.params.id;
            doorbellsQuery = "\n    SELECT *\n    FROM doorbells\n    WHERE deleted = 0 AND building_id = $1\n    ORDER BY floor, identifier\n  ";
            _context2.next = 5;
            return query(doorbellsQuery, [buildingId]);

          case 5:
            doorbells = _context2.sent;
            res.send(doorbells.rows);
            _context2.next = 12;
            break;

          case 9:
            _context2.prev = 9;
            _context2.t0 = _context2["catch"](0);
            next(_context2.t0);

          case 12:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[0, 9]]);
  }));

  return function (_x3, _x4, _x5) {
    return _ref2.apply(this, arguments);
  };
}());
router.post('/', authenticated.admin, /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee3(req, res, next) {
    var _req$body, territory, street, house_number, admin_note, lat, lng, queryString, result;

    return _regenerator.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.prev = 0;
            validateBuilding(req.body);
            _req$body = req.body, territory = _req$body.territory, street = _req$body.street, house_number = _req$body.house_number, admin_note = _req$body.admin_note, lat = _req$body.lat, lng = _req$body.lng;
            queryString = "\n      SELECT * FROM buildings WHERE street = $1 AND house_number = $2\n    ";
            _context3.next = 6;
            return query(queryString, [street, house_number]);

          case 6:
            result = _context3.sent;

            if (!result.rows.length) {
              _context3.next = 9;
              break;
            }

            return _context3.abrupt("return", next(new CustomError(400, 'Ya existe un edificio en esa dirección')));

          case 9:
            _context3.next = 11;
            return query("\n      INSERT INTO buildings (territory, street, house_number, admin_note, lat, lng) VALUES ($1, $2, $3, $4, $5, $6)\n      ", [territory, street, house_number, admin_note, lat, lng]);

          case 11:
            res.send();
            _context3.next = 17;
            break;

          case 14:
            _context3.prev = 14;
            _context3.t0 = _context3["catch"](0);
            next(_context3.t0);

          case 17:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[0, 14]]);
  }));

  return function (_x6, _x7, _x8) {
    return _ref3.apply(this, arguments);
  };
}());
router.delete('/:id', authenticated.admin, /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee4(req, res, next) {
    var id;
    return _regenerator.default.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.prev = 0;
            id = req.params.id;
            _context4.next = 4;
            return query("\n      DELETE FROM buildings WHERE id = $1\n      ", [id]);

          case 4:
            _context4.next = 6;
            return query(" \n      UPDATE doorbells SET deleted = 1 WHERE building_id = $1\n      ", [id]);

          case 6:
            res.send();
            _context4.next = 12;
            break;

          case 9:
            _context4.prev = 9;
            _context4.t0 = _context4["catch"](0);
            next(_context4.t0);

          case 12:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, null, [[0, 9]]);
  }));

  return function (_x9, _x10, _x11) {
    return _ref4.apply(this, arguments);
  };
}());
module.exports = router;
//# sourceMappingURL=buildings.js.map