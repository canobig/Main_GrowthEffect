import { StatusCodes } from 'http-status-codes'
import { getRunningExpressApp } from '../../utils/getRunningExpressApp'
import { InternalFlowiseError } from '../../errors/internalFlowiseError'
import { getErrorMessage } from '../../errors/utils'
import { User } from '../../database/entities/User'

const login = async (userEmail: string, encryptPass: string): Promise<User> => {
    try {
        const appServer = getRunningExpressApp()

        if (typeof !userEmail || !encryptPass) {
            throw new InternalFlowiseError(
                StatusCodes.PRECONDITION_FAILED,
                `Error: loginService.login - User email and password not provided!`
            )
        }

        const dbResponse = await appServer.AppDataSource.getRepository(User).find({
            where: {
                userEmail
            }
        })

        if (!dbResponse || dbResponse.length === 0) {
            throw new InternalFlowiseError(StatusCodes.NOT_FOUND, `Login ${userEmail} not found`)
        }

        return dbResponse[0]
    } catch (error) {
        throw new InternalFlowiseError(StatusCodes.INTERNAL_SERVER_ERROR, `Error: loginService.login - ${getErrorMessage(error)}`)
    }
}

export default {
    login
}
