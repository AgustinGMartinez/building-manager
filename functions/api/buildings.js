const Joi = require('joi')
const express = require('express'),
  router = express.Router()
const query = require('../mysql')
const CustomError = require('../errors')
const authenticated = require('../middlewares/authenticated')

function validateBuilding(building) {
  const schema = {
    territory: Joi.number().required(),
    street: Joi.string().required(),
    house_number: Joi.string().required(),
    admin_note: Joi.string()
      .optional()
      .allow(''),
    lat: Joi.number().required(),
    lng: Joi.number().required(),
  }
  const { error } = Joi.validate(building, schema)
  if (error) {
    throw new CustomError(400, error)
  }
}

router.get('/', authenticated.admin, async (req, res) => {
  const buildingsQuery = `
  SELECT b.*, IF(d.doorbell_count IS NULL, 0, d.doorbell_count) as doorbell_count
  FROM buildings b
  LEFT JOIN (
    SELECT building_id, count(*) as doorbell_count
      FROM doorbells
      WHERE deleted = 0
      GROUP BY building_id
  ) as d
  ON b.id = d.building_id
  `
  const doorbellsQuery = `
    SELECT *
    FROM doorbells
    WHERE deleted = 0
  `
  const buildings = await query(buildingsQuery)
  const doorbells = await query(doorbellsQuery)
  buildings.forEach(building => {
    const bId = building.id
    const bDoorbells = []
    doorbells.forEach(doorbell => {
      if (doorbell.building_id === bId) {
        bDoorbells.push(doorbell)
      }
    })
    building.doorbells = bDoorbells
  })
  res.send(buildings)
})

router.get('/:id/doorbells', authenticated.admin, async (req, res, next) => {
  const buildingId = req.params.id
  const doorbellsQuery = `
    SELECT *
    FROM doorbells
    WHERE deleted = 0 AND building_id = ?
    ORDER BY floor, identifier
  `
  const doorbells = await query(doorbellsQuery, buildingId)
  res.send(doorbells)
})

router.post('/', authenticated.admin, async (req, res, next) => {
  try {
    validateBuilding(req.body)
    const { territory, street, house_number, admin_note, lat, lng } = req.body
    const queryString = `
      SELECT * FROM buildings WHERE street = '${street}' AND house_number = ${house_number}
    `
    const result = await query(queryString)
    if (result.length) {
      return next(new CustomError(400, 'Ya existe un edificio en esa dirección'))
    }
    await query(
      `
      INSERT INTO buildings (territory, street, house_number, admin_note, lat, lng) VALUES (?, ?, ?, ?, ?, ?)
      `,
      [territory, street, house_number, admin_note, lat, lng],
    )
    res.send()
  } catch (err) {
    next(err)
  }
})

router.delete('/:id', authenticated.admin, async (req, res, next) => {
  try {
    const { id } = req.params
    await query(
      `
      DELETE FROM buildings WHERE id = ?
      `,
      [id],
    )
    await query(
      ` 
      UPDATE doorbells SET deleted = 1 WHERE building_id = ?
      `,
      [id],
    )
    res.send()
  } catch (err) {
    next(err)
  }
})

module.exports = router
