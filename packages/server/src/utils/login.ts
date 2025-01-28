import { Request, Response } from 'express'
import { User } from '../database/entities/User'
import { getRunningExpressApp } from './getRunningExpressApp'
import { InternalFlowiseError } from '../errors/internalFlowiseError'
import { StatusCodes } from 'http-status-codes';
import { getErrorMessage } from '../errors/utils'

/**
 * User login
 * @param {string} customEmail
 * @param {string} customPass
 * @returns {boolean}
 */
export const utilLogIn = async (customEmail: string, customPass: string): Promise<StatusCodes> => {
    const appServer = getRunningExpressApp()

    try {
        // const user = await appServer.AppDataSource.getRepository(User).findOne({
        //     where: {
        //         userEmail: customEmail,
        //         encryptPass: customPass
        //     }
        // })
        const user= null;

        if (!user) {
            return StatusCodes.PRECONDITION_FAILED;
        }

        return StatusCodes.OK;
    } catch (error) {
        return StatusCodes.INTERNAL_SERVER_ERROR;
    }
}

/**
 * User logout
 * @returns {boolean}
 */
export const utilLogOut = async (req: Request, res: Response) => {
    //const { email , password } = req.body;
    try {
        return 1
    } catch {
        return 0
    }
}
