const Joi = require("joi")
const express = require("express"),
  router = express.Router()
const query = require("../mysql")
const bcrypt = require("bcrypt")
const CustomError = require("../errors")

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
    isAdmin: Joi.boolean().required()
  }
  const { error } = Joi.validate(user, schema)
  if (error) {
    throw new CustomError(400, error)
  }
}

router.get("/", async (req, res) => {
  const getAdmin = req.query.admin || 0
  const queryString = `
    SELECT id, username, name, lastname, CONCAT (name, ' ', lastname) as fullname
    from users
    where is_admin = ${getAdmin}
  `
  const result = await query(queryString)
  res.send(result)
})

router.post("/", async (req, res, next) => {
  try {
    validateUser(req.body)
    const { username, password, name, lastname, isAdmin } = req.body
    const queryString = `
      SELECT * from users where username = '${username}'
    `
    const result = await query(queryString)
    if (result.length) {
      return next(new CustomError(400, "Ya existe un usuario con ese nombre"))
    }
    const salt = await bcrypt.genSalt(5)
    const saltedPassword = await bcrypt.hash(password, salt)
    await query(
      `
      INSERT INTO users (username, password, name, lastname, is_admin, salt) VALUES (?, ?, ?, ?, ?, ?)
      `,
      [username, saltedPassword, name, lastname, isAdmin ? 1 : 0, salt]
    )
    res.send()
  } catch (err) {
    next(err)
  }
})

module.exports = router
