//controoller

import { Request, Response, NextFunction } from 'express'

import { StatusCodes } from 'http-status-codes'

import { InternalFlowiseError } from '../../errors/internalFlowiseError'

import apiUserService from '../../services/user'

// Get api keys

const checkUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const apiResponse = await apiUserService.checkIfUserExist(req.body.email, req.body.password)

        console.log(apiResponse)

        return res.json(apiResponse)
    } catch (error) {
        next(error)
    }
}

export default {
    checkUser
}
