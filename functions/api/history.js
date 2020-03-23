const express = require('express'),
  router = express.Router()
const query = require('../db')
const authenticated = require('../middlewares/authenticated')

router.get('/', authenticated.admin, async (req, res, next) => {
  try {
    const { from, to } = req.query
    const queryString = `
    SELECT h.*, d.building_id
    FROM history h
    INNER JOIN doorbells d
    ON h.doorbell_special_id = d.special_id
    WHERE 1 = 1
    ${from && to ? 'AND completed_at BETWEEN $1 AND $2' : ''}
  `
    const result = await query(queryString, [from, to])
    res.send(result.rows)
  } catch (err) {
    next(err)
  }
})

module.exports = router
