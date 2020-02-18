const Joi = require('joi')
const express = require('express'),
  router = express.Router()
const query = require('../mysql')
const CustomError = require('../errors')
const AuthUtils = require('../utils/authentication')

function validateLogin(auth) {
  const schema = {
    username: Joi.string().required(),
    password: Joi.string().required(),
  }
  const { error } = Joi.validate(auth, schema)
  if (error) {
    throw new CustomError(400, error)
  }
}

router.post('/login', async (req, res, next) => {
  try {
    validateLogin(req.body)
    const { username, password } = req.body
    const getUserQuery = `
      select * from users where username = ? limit 1
    `
    const user = (await query(getUserQuery, username))[0]
    const isAuth = await AuthUtils.comparePassword(password, user.password)
    if (!isAuth) throw new CustomError(401, 'Usuario o contraseña inválidos.')
    const token = AuthUtils.generateJwt({ ...user })
    res.send({ token, user })
  } catch (err) {
    next(err)
  }
})

module.exports = router
