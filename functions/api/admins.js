const Joi = require('joi')
const express = require('express'),
  router = express.Router()
const query = require('../db')
const CustomError = require('../errors')
const AuthUtils = require('../utils/authentication')
const authenticated = require('../middlewares/authenticated')

function validateAdmin(admin) {
  const schema = {
    username: Joi.string()
      .min(3)
      .required(),
    password: Joi.string()
      .min(6)
      .required(),
    name: Joi.string().required(),
    lastname: Joi.string().required(),
    isSuperadmin: Joi.boolean().required(),
  }
  const { error } = Joi.validate(admin, schema)
  if (error) {
    throw new CustomError(400, error)
  }
}

router.get('/', authenticated.superadmin, async (req, res) => {
  const queryString = `
    SELECT *, CONCAT (name, ' ', lastname) as fullname
    from users
    where is_admin = 1 OR is_superadmin = 1
  `
  const result = await query(queryString)
  res.send(result.rows)
})

router.post('/', authenticated.superadmin, async (req, res, next) => {
  try {
    validateAdmin(req.body)
    const { username, password, name, lastname, isSuperadmin } = req.body
    const queryString = `
      SELECT * from users where username = '${username}'
    `
    const result = await query(queryString)
    if (result.rows.length) {
      return next(new CustomError(400, 'Ya existe un usuario con ese nombre'))
    }
    const saltedPassword = await AuthUtils.hashPassword(password)
    await query(
      `
      INSERT INTO users (username, password, name, lastname, is_admin, is_superadmin) VALUES ($1, $2, $3, $4, $5, $6)
      `,
      [username, saltedPassword, name, lastname, 1, isSuperadmin ? 1 : 0],
    )
    res.send()
  } catch (err) {
    next(err)
  }
})

router.delete('/:id', authenticated.superadmin, async (req, res, next) => {
  try {
    const { id } = req.params
    const deleteQuery = `
      DELETE FROM users WHERE id = $1
    `
    await query(deleteQuery, [id])
    res.send()
  } catch (err) {
    next(err)
  }
})

module.exports = router
