"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var express = require('express'),
    router = express.Router();

var query = require('../db');

var authenticated = require('../middlewares/authenticated');

router.get('/', authenticated.admin, /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee(req, res, next) {
    var _req$query, from, to, queryString, result;

    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _req$query = req.query, from = _req$query.from, to = _req$query.to;
            queryString = "\n    SELECT h.*, d.building_id\n    FROM history h\n    INNER JOIN doorbells d\n    ON h.doorbell_special_id = d.special_id\n    WHERE 1 = 1\n    ".concat(from && to ? 'AND completed_at BETWEEN $1 AND $2' : '', "\n  ");
            _context.next = 5;
            return query(queryString, [from, to]);

          case 5:
            result = _context.sent;
            res.send(result.rows);
            _context.next = 12;
            break;

          case 9:
            _context.prev = 9;
            _context.t0 = _context["catch"](0);
            next(_context.t0);

          case 12:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 9]]);
  }));

  return function (_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}());
module.exports = router;
//# sourceMappingURL=history.js.map