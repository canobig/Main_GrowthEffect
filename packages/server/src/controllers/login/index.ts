import { Request, Response, NextFunction } from 'express'
import loginService from '../../services/login'

const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const loginResponse = await loginService.login(req.body.email, req.body.password, res)
        return res.json(loginResponse)
    } catch (error) {
        next(error)
    }
}

export default {
    login
}
