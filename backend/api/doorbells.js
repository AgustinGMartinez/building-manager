import Joi from 'joi'
import express from 'express'
import query from '../db'
import CustomError from '../errors'
import authenticated from '../middlewares/authenticated'
import { createQueryValues } from '../utils/db'

const router = express.Router()

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

router.post('/', authenticated.admin, async (req, res, next) => {
  try {
    validateUpsert(req.body)
    const { buildingId, doorbells } = req.body
    const setAllDeletedQuery = `
      UPDATE doorbells SET deleted = 1 where building_id = $1
    `
    await query(setAllDeletedQuery, [buildingId])
    const upsertQueryData = doorbells.reduce((acc, { floor, identifier }) => {
      return acc.concat(buildingId, floor, identifier, `${buildingId}${floor}${identifier}`)
    }, [])
    const partialUpsertQuery = `
      INSERT INTO doorbells (building_id, floor, identifier, special_id)
      VALUES ?
      ON CONFLICT (special_id) DO UPDATE
        SET deleted = 0
    `
    const upsertQuery = createQueryValues(partialUpsertQuery, upsertQueryData, 4)
    await query(upsertQuery, upsertQueryData)
    res.send()
  } catch (err) {
    next(err)
  }
})

export default router
