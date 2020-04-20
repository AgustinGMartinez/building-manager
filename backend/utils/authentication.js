import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { config } from 'firebase-functions'

const generateJwt = payload => {
  return jwt.sign(payload, config().jwt.secret)
}

const generateHash = () => bcrypt.genSalt(5)

const hashPassword = async password => {
  return bcrypt.hash(password, 10)
}

const comparePassword = async (password, hash) => {
  return bcrypt.compare(password, hash)
}

export default { generateJwt, hashPassword, comparePassword, generateHash }
