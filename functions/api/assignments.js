const Joi = require('joi')
const express = require('express'),
  router = express.Router()
const query = require('../db')
const CustomError = require('../errors')
const authenticated = require('../middlewares/authenticated')
const createQueryValues = require('../utils/db').createQueryValues
const validateUserId = require('../utils/validateUserId').validateUserId

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

const getAssignments = async ({ id, campaign_id, user_id }) => {
  const noQueries = !id && !campaign_id && !user_id
  const assignmentsQuery = `
    SELECT a.*, u.name as user_name, u.lastname as user_lastname, u.id as user_id, c.name as campaign_name
    from assignments a
    inner join user_assignments ua
    on ua.assignment_id = a.id
    inner join users u
    on u.id = ua.user_id
    LEFT JOIN campaigns c
    ON a.campaign_id = c.id
    WHERE 1 = 1
    ${id ? 'AND a.id = $1' : ''}
    ${campaign_id ? 'AND a.campaign_id = $1' : ''}
    ${user_id ? 'AND ua.user_id = $1' : ''}
    ${noQueries ? 'AND a.completed = 0' : ''}
  `
  const doorbellsAssignmentsQuery = `
    SELECT *
    from doorbells_assignments da
    INNER JOIN doorbells d
    ON d.special_id = da.doorbell_special_id
    WHERE d.deleted = 0
    ${id ? 'AND da.assignment_id = $1' : ''}
  `
  const buildingsQuery = `
    SELECT *
    from buildings
  `
  const [assignments, doorbellsAssignments, buildings] = await Promise.all([
    query(assignmentsQuery, [id, campaign_id, user_id]),
    query(doorbellsAssignmentsQuery, [id]),
    query(buildingsQuery),
  ])

  assignments.rows.forEach(assigment => {
    const assignmentId = assigment.id
    const aBuildingsIds = []
    const aBuildings = []
    const aDoorbells = []
    const aTerritories = []

    doorbellsAssignments.rows.forEach(doorbellAssigment => {
      if (doorbellAssigment.assignment_id === assignmentId) {
        aDoorbells.push({ ...doorbellAssigment, completed: doorbellAssigment.completed })
        aBuildingsIds.push(doorbellAssigment.building_id)
      }
    })
    ;[...new Set(aBuildingsIds)].forEach(id => {
      const building = buildings.rows.find(b => b.id === id)
      if (building) {
        aBuildings.push(building)
        aTerritories.push(building.territory)
      }
    })

    assigment.doorbells = aDoorbells
    assigment.buildings = aBuildings
    assigment.territories = [...new Set(aTerritories)]
  })
  return assignments.rows
}

router.get('/', authenticated.user, async (req, res, next) => {
  try {
    validateUserId(req)
    // this is only prepared to take one value as defined
    const { campaign_id, user_id } = req.query
    const assignments = await getAssignments({ campaign_id, user_id })
    res.send(assignments)
  } catch (err) {
    next(err)
  }
})

router.get('/:id', authenticated.user, async (req, res) => {
  try {
    const assignment = await getAssignments({ id: req.params.id })
    res.send(assignment)
  } catch (err) {
    next(err)
  }
})

router.post('/', authenticated.admin, async (req, res, next) => {
  try {
    validateAssignment(req.body)
    const { user_id, note, doorbells, campaign_id } = req.body
    const assignmentQuery = `
      INSERT INTO assignments (admin_note, campaign_id)
      VALUES ($1, $2)
      RETURNING id
    `
    const { rows } = await query(assignmentQuery, [note, campaign_id || null])
    const assignment_id = rows[0].id
    const userAssignmentsQuery = `
      INSERT INTO user_assignments (user_id, assignment_id)
      VALUES ($1, $2)
    `
    await query(userAssignmentsQuery, [user_id, assignment_id])
    const doorbellsAssignmentsData = doorbells.reduce((acc, doorbell) => {
      return acc.concat(assignment_id, doorbell.building_id, doorbell.special_id)
    }, [])
    const partialDoorbellsAssignmentsQuery = `
      INSERT INTO doorbells_assignments (assignment_id, building_id, doorbell_special_id)
      VALUES ?
    `
    const doorbellsAssignmentsQuery = createQueryValues(
      partialDoorbellsAssignmentsQuery,
      doorbellsAssignmentsData,
      3,
    )
    await query(doorbellsAssignmentsQuery, doorbellsAssignmentsData)
    res.send()
  } catch (err) {
    next(err)
  }
})

router.put('/:id', authenticated.user, async (req, res, next) => {
  try {
    const { specialId, buildingId } = req.body
    const assignmentId = req.params.id
    // validate assignmet id belonging to user
    const userId = req.user.id
    const isAdmin = req.user.is_admin
    const assignment = (await getAssignments({ id: assignmentId }))[0]
    if (!assignment) throw new CustomError(404, 'Assignment not found')
    if (!isAdmin && assignment.user_id !== userId) throw new CustomError(403, 'Sin trampas please')

    // if assignment is complete, ignore petition
    if (assignment.completed) throw new CustomError(400, "Can't modify completed assignment")

    // toogle boorbell
    const toggleDoorbellQuery = `
      UPDATE doorbells_assignments
      SET completed = 1 - completed
      WHERE assignment_id = $1 AND doorbell_special_id = $2
    `
    await query(toggleDoorbellQuery, [assignmentId, specialId])

    // update building last done
    const updateBuildingLastDoneQuery = `
      UPDATE buildings
      SET last_done = NOW()
      WHERE id = $1
    `
    await query(updateBuildingLastDoneQuery, [buildingId])

    // TODO: revert last done if user toggles off building

    // if toggled doorbell was last one, finish assignment
    const pendingCompletion = []
    assignment.doorbells.forEach(d => {
      if (!d.completed) pendingCompletion.push(d.special_id)
    })
    const isCompleted = pendingCompletion.length === 1 && pendingCompletion.includes(specialId)
    if (isCompleted) {
      const setAssignmentCompletedQuery = `
        UPDATE assignments
        SET completed = 1
        WHERE id = $1
      `
      await query(setAssignmentCompletedQuery, [assignmentId])
    }

    res.send()
  } catch (err) {
    next(err)
  }
})

router.delete('/:id', authenticated.admin, async (req, res, next) => {
  const { id } = req.params
  try {
    await query(
      `
      DELETE FROM assignments where id = $1
      `,
      [id],
    )
    res.send()
  } catch (err) {
    next(err)
  }
})

module.exports = router
