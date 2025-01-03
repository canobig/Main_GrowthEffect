import { Request, Response } from 'express'
import { User } from '../database/entities/User'
import { getRunningExpressApp } from './getRunningExpressApp'
import { InternalFlowiseError } from '../errors/internalFlowiseError'
//import { StatusCodes } from 'http-status-codes';
import { getErrorMessage } from '../errors/utils'

/**
 * Verify valid passwords
 * @param {string} storedPass
 * @param {string} customPass
 * @returns {boolean}
 */
export const comparePasswords = (storedPass: string, customPass: string): boolean => {
    const [hashedPassword, salt] = storedPass.split('.')
    const buffer = scryptSync(customPass, salt, 64) as Buffer
    return timingSafeEqual(Buffer.from(hashedPassword, 'hex'), buffer)
}

/**
 * User login
 * @param {string} customEmail
 * @param {string} customPass
 * @returns {boolean}
 */
export const utilLogIn = async (customEmail: string, customPass: string) => {
    const appServer = getRunningExpressApp()

    try {
        if (typeof customEmail === 'undefined' || !customEmail) {
            //throw new InternalFlowiseError(StatusCodes.PRECONDITION_FAILED, `Error: loginController.LogIn - User email not provided!`)
        }

        if (typeof customPass === 'undefined' || !customPass) {
            //throw new InternalFlowiseError(StatusCodes.PRECONDITION_FAILED, `Error: loginController.LogIn - User password not provided!`)
        }

        const user = await appServer.AppDataSource.getRepository(User).find({
            where: {
                userEmail: customEmail
            }
        })

        //if (!user)
        //throw new InternalFlowiseError(StatusCodes.PRECONDITION_FAILED, `Error: loginController.LogIn - No user find!`)

        //if (!comparePasswords(user.keys.arguments.encryptPass, customPass))
        //throw new InternalFlowiseError(StatusCodes.PRECONDITION_FAILED, `Error: loginController.LogIn - Incorrect Password Entry!`)
    } catch (error) {
        //throw new InternalFlowiseError(StatusCodes.INTERNAL_SERVER_ERROR, `Error: loginController - ${getErrorMessage(error)}`)
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
function scryptSync(customPass: string, salt: string, arg2: number): Buffer {
    throw new Error('Function not implemented.')
}

function timingSafeEqual(arg0: Buffer, buffer: Buffer): boolean {
    throw new Error('Function not implemented.')
}
