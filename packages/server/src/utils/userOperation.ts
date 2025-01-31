import { getRunningExpressApp } from '../utils/getRunningExpressApp'
import { User } from '../database/entities/User'
import { InternalFlowiseError } from '../errors/internalFlowiseError'
import { StatusCodes } from 'http-status-codes'
import { getErrorMessage } from '../errors/utils'
import bcrypt from 'bcryptjs'

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
            return StatusCodes.PRECONDITION_FAILED;
        }

        return user.name
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