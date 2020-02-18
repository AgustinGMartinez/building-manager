const Joi = require('joi')
const express = require('express'),
  router = express.Router()
const query = require('../mysql')
const CustomError = require('../errors')
const authenticated = require('../middlewares/authenticated')

// TODO
/* function validateAssignment(building) {
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
} */

const getAssignments = async (id = undefined) => {
  const assignmentsQuery = `
    SELECT a.*, u.name as user_name, u.lastname as user_lastname, u.id as user_id
    from assignments a
    ${id ? 'where id = ?' : ''}
    inner join user_assignments ua
    on ua.assignment_id = a.id
    inner join users u
    on u.id = ua.user_id
  `
  const doorbellsQuery = `
    SELECT *
    from doorbells
    where deleted = 0
  `
  const doorbellsAssignmentsQuery = `
    SELECT *
    from doorbells_assignments
    ${id ? 'where assignment_id = ?' : ''}
  `
  const buildingsQuery = `
    SELECT *
    from buildings
  `
  const [assignments, doorbells, doorbellsAssignments, buildings] = await Promise.all([
    query(assignmentsQuery, [id]),
    query(doorbellsQuery),
    query(doorbellsAssignmentsQuery, [id]),
    query(buildingsQuery),
  ])
  assignments.forEach(assigment => {
    const assignmentId = assigment.id
    const aBuildingsIds = []
    const aBuildings = []
    const aDoorbells = []
    const aTerritories = []

    doorbellsAssignments.forEach(doorbellAssigment => {
      if (doorbellAssigment.assignment_id === assignmentId) {
        const doorbell = doorbells.find(d => d.special_id === doorbellAssigment.doorbell_special_id)
        if (doorbell) {
          aDoorbells.push({ ...doorbell, completed: doorbellAssigment.completed })
          aBuildingsIds.push(doorbell.building_id)
        }
      }
    })
    ;[...new Set(aBuildingsIds)].forEach(id => {
      const building = buildings.find(b => b.id === id)
      if (building) {
        aBuildings.push(building)
        aTerritories.push(building.territory)
      }
    })

    assigment.doorbells = aDoorbells
    assigment.buildings = aBuildings
    assigment.territories = [...new Set(aTerritories)]
  })
  return assignments
}

router.get('/', authenticated, async (req, res) => {
  const assignments = await getAssignments()
  res.send(assignments)
})

router.get('/:id', authenticated, async (req, res) => {
  const assignment = await getAssignments(req.params.id)
  res.send(assignment)
})

/* router.post('/', authenticated, async (req, res, next) => {
  try {
    validateBuilding(req.body)
    const { territory, street, house_number, admin_note, lat, lng } = req.body
    const queryString = `
      SELECT * from buildings where street = '${street}' and house_number = ${house_number}
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

router.delete('/', authenticated, async (req, res, next) => {
  try {
    const { id } = req.query
    if (!id) next(new CustomError(400, 'Missing query param'))
    await query(
      `
      DELETE FROM buildings where id = ?
      `,
      [id],
    )
    await query(
      ` 
      DELETE FROM doorbells where building_id = ?
      `,
      [id],
    )
    res.send()
  } catch (err) {
    next(err)
  }
}) */

module.exports = router
