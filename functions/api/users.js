const Joi = require('joi')
const express = require('express'),
  router = express.Router()
const query = require('../mysql')
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
    isAdmin: Joi.boolean().required(),
  }
  const { error } = Joi.validate(user, schema)
  if (error) {
    throw new CustomError(400, error)
  }
}

router.get('/', authenticated, async (req, res) => {
  res.send([{ id: 1, username: 'zhuclam', name: 'agus', lastname: 'mart', fullname: 'agus mart' }])
  const getAdmin = req.query.admin || 0
  const queryString = `
    SELECT id, username, name, lastname, CONCAT (name, ' ', lastname) as fullname
    from users
    where is_admin = ${getAdmin}
  `
  const result = await query(queryString)
  res.send(result)
})

router.post('/', authenticated, async (req, res, next) => {
  try {
    validateUser(req.body)
    const { username, password, name, lastname, isAdmin } = req.body
    const queryString = `
      SELECT * from users where username = '${username}'
    `
    const result = await query(queryString)
    if (result.length) {
      return next(new CustomError(400, 'Ya existe un usuario con ese nombre'))
    }
    const saltedPassword = await AuthUtils.hashPassword(password)
    await query(
      `
      INSERT INTO users (username, password, name, lastname, is_admin) VALUES (?, ?, ?, ?, ?)
      `,
      [username, saltedPassword, name, lastname, isAdmin ? 1 : 0],
    )
    res.send({ username, name, lastname, isAdmin: isAdmin ? 1 : 0 })
  } catch (err) {
    next(err)
  }
})

module.exports = router
