const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const functions = require('firebase-functions')

const generateJwt = payload => {
  return jwt.sign(payload, functions.config().jwt.secret)
}

const generateHash = () => bcrypt.genSalt(5)

const hashPassword = async password => {
  return bcrypt.hash(password, 10)
}

const comparePassword = async (password, hash) => {
  return bcrypt.compare(password, hash)
}

module.exports = { generateJwt, hashPassword, comparePassword, generateHash }
