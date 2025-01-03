import { Request, Response, NextFunction } from 'express'
import loginService from '../../services/login'

const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const loginResponse = await loginService.login(req.params.customEmail, req.params.customPass)
        return res.json(loginResponse)
    } catch (error) {
        next(error)
    }
}

export default {
    login
}
