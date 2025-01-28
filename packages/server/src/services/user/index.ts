import { getRunningExpressApp } from '../../utils/getRunningExpressApp'

import { User } from '../../database/entities/User'

import { InternalFlowiseError } from '../../errors/internalFlowiseError'

import { StatusCodes } from 'http-status-codes'

import { getErrorMessage } from '../../errors/utils'

import { Request } from 'express'

const checkIfUserExist = async (email: string, password: string): Promise<any> => {
    try {
        const appServer = getRunningExpressApp() //**

        console.log(`Checking user with email: ${email} and password: ${password}`); // Add logging


        const user = await appServer.AppDataSource.getRepository(User).findOneBy({
            userEmail: email,
            encryptPass: password
        })

        if (!user) {
            return "not found"
            throw new InternalFlowiseError(StatusCodes.NOT_FOUND, `User with email ${password} not found`)
        }

        return user.name
    } catch (error) {
        throw new InternalFlowiseError(
            StatusCodes.INTERNAL_SERVER_ERROR,

            `Error: chatflowsService.checkIfChatflowIsValidForStreaming - ${getErrorMessage(error)}`
        )
    }
}

export default {
    checkIfUserExist
}
