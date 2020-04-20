import Joi from 'joi'
import express from 'express'
import query from '../db'
import CustomError from '../errors'
import authenticated from '../middlewares/authenticated'
import AuthUtils from '../utils/authentication'

const router = express.Router()

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

export const getAll = async () => {
  const queryString = `
    SELECT id, username, name, lastname, CONCAT (name, ' ', lastname) as fullname
    from users
    where is_admin = 0
  `
  const { rows } = await query(queryString)
  return rows
}

router.get('/', authenticated.admin, async (req, res) => {
  const users = await getAll()
  res.send(users)
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

router.delete('/:id', authenticated.admin, async (req, res, next) => {
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

export default router
