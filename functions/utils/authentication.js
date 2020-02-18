const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const generateJwt = payload => {
  // TODO: implement env variables
  return jwt.sign(payload, 'secret')
}

const generateHash = () => bcrypt.genSalt(5)

const hashPassword = async password => {
  return bcrypt.hash(password, 10)
}

const comparePassword = async (password, hash) => {
  return bcrypt.compare(password, hash)
}

module.exports = { generateJwt, hashPassword, comparePassword, generateHash }
