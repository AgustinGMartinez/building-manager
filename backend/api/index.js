import express from 'express'
import auth from './auth'
import buildings from './buildings'
import users from './users'
import doorbells from './doorbells'
import assignments from './assignments'
import admins from './admins'
import campaigns from './campaigns'
import history from './history'

const router = express.Router()

router.use('/auth', auth)
router.use('/buildings', buildings)
router.use('/users', users)
router.use('/campaigns', campaigns)
router.use('/doorbells', doorbells)
router.use('/admins', admins)
router.use('/assignments', assignments)
router.use('/history', history)

export default router
