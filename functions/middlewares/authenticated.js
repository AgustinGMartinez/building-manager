const jwt = require('jsonwebtoken')
const CustomError = require('../errors')

const authenticated = async (req, res, next) => {
  try {
    const token = req.headers['authorization'].split(' ')[1]

    if (token) {
      // TODO: implement env variables
      jwt.verify(token, 'secret', (err, decoded) => {
        if (err) {
          throw new CustomError(401, 'Invalid token')
        } else {
          req.user = decoded
          next()
        }
      })
    } else {
      throw new CustomError(401, 'Invalid token')
    }
  } catch (err) {
    next(err)
  }
}

module.exports = authenticated
