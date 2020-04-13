"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var Joi = require('joi');

var express = require('express'),
    router = express.Router();

var query = require('../db');

var CustomError = require('../errors');

var authenticated = require('../middlewares/authenticated');

var createQueryValues = require('../utils/db').createQueryValues;

var validateUserId = require('../utils/validateUserId').validateUserId;

function validateAssignment(assignment) {
  var schema = {
    user_id: Joi.number().required(),
    note: Joi.string().optional().allow(''),
    doorbells: Joi.array().items(Joi.object({
      id: Joi.number().required(),
      building_id: Joi.number().required(),
      special_id: Joi.string().required()
    })).required(),
    campaign_id: Joi.number().optional().allow(null),
    expiry_date: Joi.date().optional().allow(null)
  };

  var _Joi$validate = Joi.validate(assignment, schema),
      error = _Joi$validate.error;

  if (error) {
    throw new CustomError(400, error);
  }
}

var getAssignments = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee2(_ref2) {
    var id, campaign_id, user_id, noQueries, assignmentsQuery, doorbellsAssignmentsQuery, buildingsQuery, _yield$Promise$all, _yield$Promise$all2, assignments, doorbellsAssignments, buildings;

    return _regenerator.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            id = _ref2.id, campaign_id = _ref2.campaign_id, user_id = _ref2.user_id;
            noQueries = !id && !campaign_id && !user_id;
            assignmentsQuery = "\n    SELECT a.*, u.name as user_name, u.lastname as user_lastname, u.id as user_id, c.name as campaign_name\n    from assignments a\n    inner join user_assignments ua\n    on ua.assignment_id = a.id\n    inner join users u\n    on u.id = ua.user_id\n    LEFT JOIN campaigns c\n    ON a.campaign_id = c.id\n    WHERE 1 = 1\n    ".concat(id ? 'AND a.id = $1' : '', "\n    ").concat(campaign_id ? 'AND a.campaign_id = $1' : '', "\n    ").concat(user_id ? 'AND ua.user_id = $1' : '', "\n    ").concat(noQueries ? 'AND a.completed = 0' : '', "\n  ");
            doorbellsAssignmentsQuery = "\n    SELECT *\n    from doorbells_assignments da\n    INNER JOIN doorbells d\n    ON d.special_id = da.doorbell_special_id\n    WHERE d.deleted = 0\n    ".concat(id ? 'AND da.assignment_id = $1' : '', "\n  ");
            buildingsQuery = "\n    SELECT *\n    from buildings\n  ";
            _context2.next = 7;
            return Promise.all([query(assignmentsQuery, [id, campaign_id, user_id]), query(doorbellsAssignmentsQuery, [id]), query(buildingsQuery)]);

          case 7:
            _yield$Promise$all = _context2.sent;
            _yield$Promise$all2 = (0, _slicedToArray2.default)(_yield$Promise$all, 3);
            assignments = _yield$Promise$all2[0];
            doorbellsAssignments = _yield$Promise$all2[1];
            buildings = _yield$Promise$all2[2];
            _context2.next = 14;
            return Promise.all(assignments.rows.map( /*#__PURE__*/function () {
              var _ref3 = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee(assignment) {
                var assignmentId, aBuildingsIds, aBuildings, aDoorbells, aTerritories, usersWithSameBuildingsAssignedQuery, _yield$query, rows, users;

                return _regenerator.default.wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        assignmentId = assignment.id;
                        aBuildingsIds = [];
                        aBuildings = [];
                        aDoorbells = [];
                        aTerritories = [];
                        doorbellsAssignments.rows.forEach(function (doorbellAssignment) {
                          if (doorbellAssignment.assignment_id === assignmentId) {
                            aDoorbells.push(_objectSpread({}, doorbellAssignment, {
                              completed: doorbellAssignment.completed
                            }));
                            aBuildingsIds.push(doorbellAssignment.building_id);
                          }
                        });
                        (0, _toConsumableArray2.default)(new Set(aBuildingsIds)).forEach(function (id) {
                          var building = buildings.rows.find(function (b) {
                            return b.id === id;
                          });

                          if (building) {
                            aBuildings.push(building);
                            aTerritories.push(building.territory);
                          }
                        });
                        assignment.doorbells = aDoorbells;
                        assignment.buildings = aBuildings;
                        assignment.territories = (0, _toConsumableArray2.default)(new Set(aTerritories));

                        if (!user_id) {
                          _context.next = 19;
                          break;
                        }

                        usersWithSameBuildingsAssignedQuery = "\n          SELECT distinct(da.assignment_id), u.name, u.lastname, ua.user_id\n          FROM doorbells_assignments da\n          INNER JOIN assignments a\n          ON a.id = da.assignment_id\n          INNER JOIN user_assignments ua\n          ON a.id = ua.assignment_id\n          INNER JOIN users u\n          ON u.id = ua.user_id\n          WHERE da.building_id in (".concat(assignment.buildings.map(function (_, i) {
                          return "$".concat(i + 2);
                        }).join(', '), ")\n          AND a.completed = 0\n          AND (a.expiry_date is null or a.expiry_date > now())\n          AND ua.user_id != $1\n        ");
                        _context.next = 14;
                        return query(usersWithSameBuildingsAssignedQuery, [user_id, assignment.buildings.map(function (b) {
                          return b.id;
                        })].flat());

                      case 14:
                        _yield$query = _context.sent;
                        rows = _yield$query.rows;
                        users = [];

                        if (rows.length) {
                          rows.forEach(function (row) {
                            var fullname = "".concat(row.name, " ").concat(row.lastname);
                            if (!users.some(function (u) {
                              return u.id === row.user_id;
                            })) users.push({
                              fullname: fullname,
                              id: row.user_id
                            });
                          });
                        }

                        assignment.usersSharingBuildings = users;

                      case 19:
                      case "end":
                        return _context.stop();
                    }
                  }
                }, _callee);
              }));

              return function (_x2) {
                return _ref3.apply(this, arguments);
              };
            }()));

          case 14:
            return _context2.abrupt("return", assignments.rows);

          case 15:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function getAssignments(_x) {
    return _ref.apply(this, arguments);
  };
}();

router.get('/', authenticated.user, /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee3(req, res, next) {
    var _req$query, campaign_id, user_id, assignments;

    return _regenerator.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.prev = 0;
            validateUserId(req); // this is only prepared to take one query value

            _req$query = req.query, campaign_id = _req$query.campaign_id, user_id = _req$query.user_id;
            _context3.next = 5;
            return getAssignments({
              campaign_id: campaign_id,
              user_id: user_id
            });

          case 5:
            assignments = _context3.sent;
            res.send(assignments);
            _context3.next = 12;
            break;

          case 9:
            _context3.prev = 9;
            _context3.t0 = _context3["catch"](0);
            next(_context3.t0);

          case 12:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[0, 9]]);
  }));

  return function (_x3, _x4, _x5) {
    return _ref4.apply(this, arguments);
  };
}());
router.get('/:id', authenticated.user, /*#__PURE__*/function () {
  var _ref5 = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee4(req, res) {
    var assignment;
    return _regenerator.default.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.prev = 0;
            _context4.next = 3;
            return getAssignments({
              id: req.params.id
            });

          case 3:
            assignment = _context4.sent;
            res.send(assignment);
            _context4.next = 10;
            break;

          case 7:
            _context4.prev = 7;
            _context4.t0 = _context4["catch"](0);
            next(_context4.t0);

          case 10:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, null, [[0, 7]]);
  }));

  return function (_x6, _x7) {
    return _ref5.apply(this, arguments);
  };
}());
router.post('/', authenticated.admin, /*#__PURE__*/function () {
  var _ref6 = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee5(req, res, next) {
    var _req$body, user_id, note, doorbells, campaign_id, expiry_date, assignmentQuery, _yield$query2, rows, assignment_id, userAssignmentsQuery, doorbellsAssignmentsData, partialDoorbellsAssignmentsQuery, doorbellsAssignmentsQuery;

    return _regenerator.default.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.prev = 0;
            validateAssignment(req.body);
            _req$body = req.body, user_id = _req$body.user_id, note = _req$body.note, doorbells = _req$body.doorbells, campaign_id = _req$body.campaign_id, expiry_date = _req$body.expiry_date;
            assignmentQuery = "\n      INSERT INTO assignments (admin_note, expiry_date, campaign_id)\n      VALUES ($1, $2, $3)\n      RETURNING id\n    ";
            _context5.next = 6;
            return query(assignmentQuery, [note, expiry_date, campaign_id]);

          case 6:
            _yield$query2 = _context5.sent;
            rows = _yield$query2.rows;
            assignment_id = rows[0].id;
            userAssignmentsQuery = "\n      INSERT INTO user_assignments (user_id, assignment_id)\n      VALUES ($1, $2)\n    ";
            _context5.next = 12;
            return query(userAssignmentsQuery, [user_id, assignment_id]);

          case 12:
            doorbellsAssignmentsData = doorbells.reduce(function (acc, doorbell) {
              return acc.concat(assignment_id, doorbell.building_id, doorbell.special_id);
            }, []);
            partialDoorbellsAssignmentsQuery = "\n      INSERT INTO doorbells_assignments (assignment_id, building_id, doorbell_special_id)\n      VALUES ?\n    ";
            doorbellsAssignmentsQuery = createQueryValues(partialDoorbellsAssignmentsQuery, doorbellsAssignmentsData, 3);
            _context5.next = 17;
            return query(doorbellsAssignmentsQuery, doorbellsAssignmentsData);

          case 17:
            res.send();
            _context5.next = 23;
            break;

          case 20:
            _context5.prev = 20;
            _context5.t0 = _context5["catch"](0);
            next(_context5.t0);

          case 23:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5, null, [[0, 20]]);
  }));

  return function (_x8, _x9, _x10) {
    return _ref6.apply(this, arguments);
  };
}());
router.put('/:id', authenticated.user, /*#__PURE__*/function () {
  var _ref7 = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee6(req, res, next) {
    var _req$body2, specialId, buildingId, assignmentId, userId, isAdmin, assignment, toggleDoorbellQuery, updateBuildingLastDoneQuery, checkIfInHistoryQuery, result, inHistory, updateHistoryQuery, _updateHistoryQuery, pendingCompletion, isCompleted, setAssignmentCompletedQuery;

    return _regenerator.default.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _context6.prev = 0;
            _req$body2 = req.body, specialId = _req$body2.specialId, buildingId = _req$body2.buildingId;
            assignmentId = req.params.id; // validate assignmet id belonging to user

            userId = req.user.id;
            isAdmin = req.user.is_admin;
            _context6.next = 7;
            return getAssignments({
              id: assignmentId
            });

          case 7:
            assignment = _context6.sent[0];

            if (assignment) {
              _context6.next = 10;
              break;
            }

            throw new CustomError(404, 'Assignment not found');

          case 10:
            if (!(!isAdmin && assignment.user_id !== userId)) {
              _context6.next = 12;
              break;
            }

            throw new CustomError(403, 'Sin trampas please');

          case 12:
            if (!assignment.completed) {
              _context6.next = 14;
              break;
            }

            throw new CustomError(400, "Can't modify completed assignment");

          case 14:
            // toogle boorbell
            toggleDoorbellQuery = "\n      UPDATE doorbells_assignments\n      SET completed = 1 - completed\n      WHERE assignment_id = $1 AND doorbell_special_id = $2\n    ";
            _context6.next = 17;
            return query(toggleDoorbellQuery, [assignmentId, specialId]);

          case 17:
            // update building last done
            updateBuildingLastDoneQuery = "\n      UPDATE buildings\n      SET last_done = NOW()\n      WHERE id = $1\n    ";
            _context6.next = 20;
            return query(updateBuildingLastDoneQuery, [buildingId]);

          case 20:
            // TODO: revert building last done if user toggles off building
            // check if this it was already registered in history
            checkIfInHistoryQuery = "\n      SELECT *\n      FROM history\n      WHERE doorbell_special_id = $1\n      AND assignment_id = $2\n    ";
            _context6.next = 23;
            return query(checkIfInHistoryQuery, [specialId, assignment.id]);

          case 23:
            result = _context6.sent;
            inHistory = result.rows.length === 1; // update history

            if (!inHistory) {
              _context6.next = 31;
              break;
            }

            updateHistoryQuery = "\n        DELETE FROM history\n        WHERE id = $1\n      ";
            _context6.next = 29;
            return query(updateHistoryQuery, [result.rows[0].id]);

          case 29:
            _context6.next = 34;
            break;

          case 31:
            _updateHistoryQuery = "\n        INSERT INTO history (doorbell_special_id, assignment_id)\n        VALUES ($1, $2)\n      ";
            _context6.next = 34;
            return query(_updateHistoryQuery, [specialId, assignment.id]);

          case 34:
            // if toggled doorbell was last one, finish assignment
            pendingCompletion = [];
            assignment.doorbells.forEach(function (d) {
              if (!d.completed) pendingCompletion.push(d.special_id);
            });
            isCompleted = pendingCompletion.length === 1 && pendingCompletion.includes(specialId);

            if (!isCompleted) {
              _context6.next = 41;
              break;
            }

            setAssignmentCompletedQuery = "\n        UPDATE assignments\n        SET completed = 1\n        WHERE id = $1\n      ";
            _context6.next = 41;
            return query(setAssignmentCompletedQuery, [assignmentId]);

          case 41:
            res.send();
            _context6.next = 47;
            break;

          case 44:
            _context6.prev = 44;
            _context6.t0 = _context6["catch"](0);
            next(_context6.t0);

          case 47:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6, null, [[0, 44]]);
  }));

  return function (_x11, _x12, _x13) {
    return _ref7.apply(this, arguments);
  };
}());
router.delete('/:id', authenticated.admin, /*#__PURE__*/function () {
  var _ref8 = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee7(req, res, next) {
    var id;
    return _regenerator.default.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            id = req.params.id;
            _context7.prev = 1;
            _context7.next = 4;
            return query("\n      DELETE FROM assignments where id = $1\n      ", [id]);

          case 4:
            res.send();
            _context7.next = 10;
            break;

          case 7:
            _context7.prev = 7;
            _context7.t0 = _context7["catch"](1);
            next(_context7.t0);

          case 10:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7, null, [[1, 7]]);
  }));

  return function (_x14, _x15, _x16) {
    return _ref8.apply(this, arguments);
  };
}());
module.exports = router;
//# sourceMappingURL=assignments.js.map