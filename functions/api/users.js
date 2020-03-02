const Joi = require('joi')
const express = require('express'),
  router = express.Router()
const query = require('../db')
const CustomError = require('../errors')
const AuthUtils = require('../utils/authentication')
const authenticated = require('../middlewares/authenticated')

function validateUser(user) {
  const schema = {
    username: Joi.string()
      .min(3)
      .required(),
    password: Joi.string()
      .min(6)
      .required(),
    name: Joi.string().required(),
    lastname: Joi.string().required(),
  }
  const { error } = Joi.validate(user, schema)
  if (error) {
    throw new CustomError(400, error)
  }
}

router.get('/', authenticated.admin, async (req, res) => {
  const queryString = `
    SELECT id, username, name, lastname, CONCAT (name, ' ', lastname) as fullname
    from users
    where is_admin = 0
  `
  const result = await query(queryString)
  res.send(result.rows)
})

router.post('/', authenticated.admin, async (req, res, next) => {
  try {
    validateUser(req.body)
    const { username, password, name, lastname } = req.body
    const queryString = `
      SELECT * from users where username = $1
    `
    const result = await query(queryString, [username])
    if (result.rows.length) {
      return next(new CustomError(400, 'Ya existe un usuario con ese nombre'))
    }
    const saltedPassword = await AuthUtils.hashPassword(password)
    await query(
      `
      INSERT INTO users (username, password, name, lastname) VALUES ($1, $2, $3, $4)
      `,
      [username, saltedPassword, name, lastname],
    )
    res.send()
  } catch (err) {
    next(err)
  }
})

module.exports = router
