const Joi = require('joi')
const express = require('express'),
  router = express.Router()
const query = require('../db')
const CustomError = require('../errors')
const authenticated = require('../middlewares/authenticated')

function validateCampaign(campaigns) {
  const schema = {
    name: Joi.string().required(),
  }
  const { error } = Joi.validate(campaigns, schema)
  if (error) {
    throw new CustomError(400, error)
  }
}

router.get('/', authenticated.admin, async (req, res) => {
  const campaignsQuery = `
  SELECT *
  FROM campaigns
  `
  const campaigns = await query(campaignsQuery)
  res.send(campaigns.rows)
})

router.post('/', authenticated.admin, async (req, res, next) => {
  try {
    validateCampaign(req.body)
    const { name } = req.body
    const checkUniqueNameQuery = `
      SELECT * from campaigns where name = $1
    `
    const result = await query(checkUniqueNameQuery, [name])
    if (result.rows.length) {
      return next(new CustomError(400, 'Ya existe una campaña con ese nombre'))
    }
    await query(
      `
      INSERT INTO campaigns (name) VALUES ($1)
      `,
      [name],
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
      DELETE FROM campaigns WHERE id = $1
      `,
      [id],
    )
    res.send()
  } catch (err) {
    next(err)
  }
})

module.exports = router
