const Joi = require('joi')
const express = require('express'),
  router = express.Router()
const query = require('../mysql')
const CustomError = require('../errors')
const authenticated = require('../middlewares/authenticated')
const removeUndefined = require('../utils/arrays').removeUndefined

function validateAssignment(assigment) {
  const schema = {
    user_id: Joi.number().required(),
    note: Joi.string()
      .optional()
      .allow(''),
    doorbells: Joi.array()
      .items(
        Joi.object({
          id: Joi.number().required(),
          building_id: Joi.number().required(),
          special_id: Joi.string().required(),
        }),
      )
      .required(),
    campaign_id: Joi.number().optional(),
  }
  const { error } = Joi.validate(assigment, schema)
  if (error) {
    throw new CustomError(400, error)
  }
}

const getAssignments = async (id = null, campaign_id = null) => {
  const assignmentsQuery = `
    SELECT a.*, u.name as user_name, u.lastname as user_lastname, u.id as user_id, c.name as campaign_name
    from assignments a
    inner join user_assignments ua
    on ua.assignment_id = a.id
    inner join users u
    on u.id = ua.user_id
    LEFT JOIN campaigns c
    ON a.campaign_id = c.id
    WHERE 1
    ${id ? 'AND a.id = ?' : ''}
    ${campaign_id ? 'AND a.campaign_id = ?' : ''}
    ${!id && !campaign_id ? 'AND a.completed = 0' : ''}
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
    query(assignmentsQuery, removeUndefined([id, campaign_id])),
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

router.get('/', authenticated.user, async (req, res) => {
  const campaign_id = req.query.campaign
  const assignments = await getAssignments(undefined, campaign_id)
  res.send(assignments)
})

router.get('/:id', authenticated.user, async (req, res) => {
  const assignment = await getAssignments(req.params.id)
  res.send(assignment)
})

router.post('/', authenticated.admin, async (req, res, next) => {
  try {
    validateAssignment(req.body)
    const { user_id, note, doorbells, campaign_id } = req.body
    const assignmentQuery = `
      INSERT INTO assignments (admin_note, campaign_id)
      VALUES (?, ?)
    `
    const { insertId: assignment_id } = await query(assignmentQuery, [note, campaign_id])
    const userAssignmentsQuery = `
      INSERT INTO user_assignments (user_id, assignment_id)
      VALUES (?, ?)
    `
    await query(userAssignmentsQuery, [user_id, assignment_id])
    const doorbellsAssignmentsQuery = `
      INSERT INTO doorbells_assignments (assignment_id, building_id, doorbell_special_id)
      VALUES ?
    `
    await query(doorbellsAssignmentsQuery, [
      doorbells.map(doorbell => [assignment_id, doorbell.building_id, doorbell.special_id]),
    ])
    res.send()
  } catch (err) {
    next(err)
  }
})

router.delete('/:id', authenticated.admin, async (req, res, next) => {
  const { id } = req.params
  console.log({ idToDelete: id })
  try {
    await query(
      `
      DELETE FROM assignments where id = ?
      `,
      [id],
    )
    res.send()
  } catch (err) {
    next(err)
  }
})

module.exports = router
