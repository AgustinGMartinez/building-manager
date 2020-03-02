const Joi = require('joi')
const express = require('express'),
  router = express.Router()
const query = require('../db')
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
  try {
    const buildingsQuery = `
    SELECT b.*, coalesce(d.doorbell_count, 0) AS doorbell_count
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
    buildings.rows.forEach(building => {
      const bId = building.id
      const bDoorbells = []
      doorbells.rows.forEach(doorbell => {
        if (doorbell.building_id === bId) {
          bDoorbells.push(doorbell)
        }
      })
      building.doorbells = bDoorbells
    })
    res.send(buildings.rows)
  } catch (err) {
    next(err)
  }
})

router.get('/:id/doorbells', authenticated.admin, async (req, res, next) => {
  try {
    const buildingId = req.params.id
    const doorbellsQuery = `
    SELECT *
    FROM doorbells
    WHERE deleted = 0 AND building_id = $1
    ORDER BY floor, identifier
  `
    const doorbells = await query(doorbellsQuery, [buildingId])
    res.send(doorbells.rows)
  } catch (err) {
    next(err)
  }
})

router.post('/', authenticated.admin, async (req, res, next) => {
  try {
    validateBuilding(req.body)
    const { territory, street, house_number, admin_note, lat, lng } = req.body
    const queryString = `
      SELECT * FROM buildings WHERE street = $1 AND house_number = $2
    `
    const result = await query(queryString, [street, house_number])
    if (result.rows.length) {
      return next(new CustomError(400, 'Ya existe un edificio en esa dirección'))
    }
    await query(
      `
      INSERT INTO buildings (territory, street, house_number, admin_note, lat, lng) VALUES ($1, $2, $3, $4, $5, $6)
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
      DELETE FROM buildings WHERE id = $1
      `,
      [id],
    )
    await query(
      ` 
      UPDATE doorbells SET deleted = 1 WHERE building_id = $1
      `,
      [id],
    )
    res.send()
  } catch (err) {
    next(err)
  }
})

module.exports = router
