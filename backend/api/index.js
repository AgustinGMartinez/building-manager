const express = require('express'),
  router = express.Router()
const auth = require('./auth')
const buildings = require('./buildings')
const users = require('./users')
const doorbells = require('./doorbells')
const assignments = require('./assignments')
const admins = require('./admins')
const campaigns = require('./campaigns')
const history = require('./history')

router.use('/auth', auth)
router.use('/buildings', buildings)
router.use('/users', users)
router.use('/campaigns', campaigns)
router.use('/doorbells', doorbells)
router.use('/admins', admins)
router.use('/assignments', assignments)
router.use('/history', history)

module.exports = router
