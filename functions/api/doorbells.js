const Joi = require('joi')
const express = require('express'),
  router = express.Router()
const query = require('../mysql')
const CustomError = require('../errors')
const authenticated = require('../middlewares/authenticated')

function validateUpsert(doorbells) {
  const schema = {
    buildingId: Joi.number().required(),
    doorbells: Joi.array()
      .items(
        Joi.object({
          floor: Joi.number(),
          identifier: Joi.string(),
        }),
      )
      .required(),
  }
  const { error } = Joi.validate(doorbells, schema)
  if (error) {
    throw new CustomError(400, error)
  }
}

router.post('/', authenticated, async (req, res, next) => {
  try {
    validateUpsert(req.body)
    const { buildingId, doorbells } = req.body
    const setAllDeletedQuery = `
      UPDATE doorbells SET deleted = 1 where building_id = ?
    `
    await query(setAllDeletedQuery, buildingId)
    const queryTemplate = []
    const queryValues = []
    doorbells.forEach(({ floor, identifier }) => {
      queryTemplate.push('(?, ?, ?, ?)')
      queryValues.push(buildingId, floor, identifier, `${buildingId}${floor}${identifier}`)
    })
    const upsertQuery = `
    INSERT INTO doorbells (building_id, floor, identifier, special_id)
    VALUES ${queryTemplate.join(', ')}
    ON DUPLICATE KEY
    UPDATE deleted = 0
    `
    await query(upsertQuery, queryValues)
    res.send()
  } catch (err) {
    next(err)
  }
})

module.exports = router
