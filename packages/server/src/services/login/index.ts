//import { StatusCodes } from 'http-status-codes'
import { InternalFlowiseError } from '../../errors/internalFlowiseError'
import { getErrorMessage } from '../../errors/utils'
import { utilLogIn } from '../../utils/login'

const login = async (customEmail: string, customPass: string) => {
    try {
        const dbResponse = await utilLogIn(customEmail, customPass)
        return dbResponse
    } catch (error) {
        // throw new InternalFlowiseError(
        //     StatusCodes.INTERNAL_SERVER_ERROR,
        //     `Error: loginService.login - ${getErrorMessage(error)}`
        // )
    }
}

export default {
    login
}
