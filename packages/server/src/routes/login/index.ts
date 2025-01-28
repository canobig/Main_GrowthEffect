import express from 'express'
import loginController from '../../controllers/login'
const router = express.Router()

// Login
router.post('/', loginController.login)

export default router
