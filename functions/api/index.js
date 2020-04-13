"use strict";

var express = require('express'),
    router = express.Router();

var auth = require('./auth');

var buildings = require('./buildings');

var users = require('./users');

var doorbells = require('./doorbells');

var assignments = require('./assignments');

var admins = require('./admins');

var campaigns = require('./campaigns');

var history = require('./history');

router.use('/auth', auth);
router.use('/buildings', buildings);
router.use('/users', users);
router.use('/campaigns', campaigns);
router.use('/doorbells', doorbells);
router.use('/admins', admins);
router.use('/assignments', assignments);
router.use('/history', history);
module.exports = router;
//# sourceMappingURL=index.js.map