import express from 'express'
import loginController from '../../controllers/login'
import userController from '../../controllers/user'
const router = express.Router()

// Login
//router.post('/', loginController.login)
router.post('/', userController.checkUser)
export default router
