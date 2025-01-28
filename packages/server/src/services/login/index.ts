import { getErrorMessage } from '../../errors/utils'
import { StatusCodes } from 'http-status-codes'
import { utilLogIn } from '../../utils/login'

const failedAttempts: { [key: string]: number } = {}

const login = async (userEmail: string, encryptPass: string): Promise<{ status: StatusCodes, message: string }> => {
    try {
        if (!userEmail || !encryptPass) {
            return {
                status: StatusCodes.PRECONDITION_FAILED,
                message: 'User email or password not provided!'
            }
        }

        if (failedAttempts[encryptPass] >= 3) {
            //veritabanı güncelleme işi yazılacak
            return {
                status: StatusCodes.FORBIDDEN,
                message: 'Hesap, çok fazla başarısız giriş denemesi nedeniyle kilitlendi. Lütfen daha sonra tekrar deneyin.'
            }
        }

        const dbResponse = await utilLogIn(userEmail, encryptPass)

        if (dbResponse === StatusCodes.PRECONDITION_FAILED) {
            failedAttempts[encryptPass] = (failedAttempts[encryptPass] || 0) + 1
            return {
                status: StatusCodes.PRECONDITION_FAILED,
                message: 'Kullanıcı ya da şifre hatalı girildi. Lütfen kontrol ediniz.'
            }
        }

        failedAttempts[userEmail] = 0

        return {
            status: StatusCodes.OK,
            message: 'Login başarılı'
        }
    } catch (error) {
        return {
            status: StatusCodes.INTERNAL_SERVER_ERROR,
            message: `Error: loginService.login - ${getErrorMessage(error)}`
        }
    }
}

export default {
    login
}
