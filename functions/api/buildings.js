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

router.get('/', authenticated, async (req, res) => {
  res.send([
    { id: 1, address: 'direccion 1' },
    { id: 2, address: 'direccion 2' },
  ])
  const buildingsQuery = `
    SELECT *, (select count(*) FROM doorbells) as doorbell_count
    FROM buildings
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

router.get('/:id/doorbells', authenticated, async (req, res, next) => {
  if (req.params.id === '1')
    res.send([
      { id: 1, floor: 1, identifier: '1', special_id: '811', building_id: 8 },
      { id: 2, floor: 1, identifier: '2', special_id: '812', building_id: 8 },
    ])
  if (req.params.id === '2')
    res.send([
      { id: 4, floor: 2, identifier: '1', special_id: '521', building_id: 5 },
      { id: 5, floor: 2, identifier: '2', special_id: '522', building_id: 5 },
    ])
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

router.post('/', authenticated, async (req, res, next) => {
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

router.delete('/:id', authenticated, async (req, res, next) => {
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
      DELETE FROM doorbells WHERE building_id = ?
      `,
      [id],
    )
    res.send()
  } catch (err) {
    next(err)
  }
})

module.exports = router
