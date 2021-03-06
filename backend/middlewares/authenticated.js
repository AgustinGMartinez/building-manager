import jwt from 'jsonwebtoken'
import CustomError from '../errors'
import { config } from 'firebase-functions'

const userTypes = {
  superadmin: {
    // only superadmins can bypass this validation
    validate: user => user.is_superadmin === 1,
  },
  admin: {
    // admins and superadmins can bypass admin validation
    validate: user => user.is_admin === 1,
  },
  user: {
    // any valid token can bypass user validation
    validate: () => true,
  },
}

const authenticate = type => async (req, res, next) => {
  try {
    const token = req.headers['authorization'].split(' ')[1]

    if (token) {
      jwt.verify(token, config().jwt.secret, (err, decoded) => {
        if (err) {
          throw new CustomError(401, 'Invalid token')
        } else {
          if (!userTypes[type].validate(decoded)) {
            throw new CustomError(401, 'Invalid token')
          }
          req.user = decoded
          next()
        }
      })
    } else {
      throw new CustomError(401, 'Invalid token')
    }
  } catch (err) {
    if (err instanceof CustomError) return next(err)
    next(new CustomError(401, err.message))
  }
}

const authenticated = {
  superadmin: authenticate('superadmin'),
  admin: authenticate('admin'),
  user: authenticate('user'),
}

export default authenticated
