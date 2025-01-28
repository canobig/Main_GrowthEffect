import { Request, Response } from 'express'
import { getRunningExpressApp } from './getRunningExpressApp'
import { StatusCodes } from 'http-status-codes';
import { checkIfUserExist } from './userOperation';

/**
 * User login
 * @param {string} customEmail
 * @param {string} customPass
 * @returns {boolean}
 */
export const utilLogIn = async (customEmail: string, customPass: string): Promise<StatusCodes> => {
    const appServer = getRunningExpressApp()

    try {
        
        const response = await checkIfUserExist(customEmail, customPass);

        if (!response) {
            return StatusCodes.PRECONDITION_FAILED;
        }

        return response;
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
