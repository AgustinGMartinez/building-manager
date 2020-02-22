const express = require('express'),
  router = express.Router()
const auth = require('./auth')
const buildings = require('./buildings')
const users = require('./users')
const doorbells = require('./doorbells')
const assignments = require('./assignments')
const admins = require('./admins')

router.use('/auth', auth)
router.use('/buildings', buildings)
router.use('/users', users)
router.use('/admins', admins)
router.use('/doorbells', doorbells)
router.use('/assignments', assignments)

module.exports = router
