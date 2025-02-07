import { getRunningExpressApp } from '../utils/getRunningExpressApp'
import { User } from '../database/entities/User'
import { InternalFlowiseError } from '../errors/internalFlowiseError'
import { StatusCodes } from 'http-status-codes'
import { getErrorMessage } from '../errors/utils'
import bcrypt from 'bcryptjs'

const failedAttempts: { [key: string]: number } = {}

const setUserPassive = async (user: User): Promise<StatusCodes> => {
    try {
        const appServer = getRunningExpressApp()
        user.isActive = false;
        await appServer.AppDataSource.getRepository(User).save(user);
        return StatusCodes.FORBIDDEN;
 
    } catch (error) {
        throw new InternalFlowiseError(
            StatusCodes.INTERNAL_SERVER_ERROR,
            `Error: loginService.setUserPassive - ${getErrorMessage(error)}`
        )
    }
}

export const checkIfUserExist = async (email: string, password: string): Promise<any> => {
    try {
        const appServer = getRunningExpressApp() 
        const user = await appServer.AppDataSource.getRepository(User).findOneBy({
            userEmail: email
        })

        if (!user) {
            return StatusCodes.PRECONDITION_FAILED;
        }

        const isMatch = await bcrypt.compare(password, user.encryptPass);

        if (!isMatch) {
            failedAttempts[email] = (failedAttempts[email] || 0) + 1
            
            if (failedAttempts[email] >= 3) {
            
                await setUserPassive(user);     
                return StatusCodes.FORBIDDEN;
            } else {
                return StatusCodes.PRECONDITION_FAILED;
            }
        }

        return user
    } catch (error) {
        throw new InternalFlowiseError(
            StatusCodes.INTERNAL_SERVER_ERROR,
            `Error: loginService.checkIfUserExist - ${getErrorMessage(error)}`
        )
    }
}

export default {
    checkIfUserExist
}