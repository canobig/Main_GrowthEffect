import { StatusCodes } from 'http-status-codes'
import { utilLogIn } from '../../utils/login'
//import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken';
import { Response } from 'express';

const failedAttempts: { [key: string]: number } = {}

// const encryptPassword = async (userPass: string) => {
//   const hashedPassword = await bcrypt.hash(userPass, 10)
//   return hashedPassword
// }

function generateToken() {
    const secretKey = "sanatcilarsitesi";
    const expiresIn = "1h";
  
    const token = jwt.sign({}, secretKey, { expiresIn });
    return token;
  }

const login = async (userEmail: string, userPass: string, res: Response): Promise<{ status: StatusCodes, message: string }> => {
    try {

        if (!userEmail || !userPass) {
            return {
                status: StatusCodes.PRECONDITION_FAILED,
                message: 'User email or password not provided!'
            }
        }
        
        if (failedAttempts[userEmail] >= 3) {
            //veritabanı güncelleme işi yazılacak
            return {
                status: StatusCodes.FORBIDDEN,
                message: 'Hesap, çok fazla başarısız giriş denemesi nedeniyle kilitlendi. Lütfen daha sonra tekrar deneyin.'
            }
        }

        const dbResponse = await utilLogIn(userEmail, userPass)

        if (dbResponse === StatusCodes.INTERNAL_SERVER_ERROR) {
            return {
                status: StatusCodes.INTERNAL_SERVER_ERROR,
                message: 'Login işlemi sırasında bir hata oluştu. Lütfen yönetici ile iletişime geçiniz.'
            }
        }

        if (dbResponse === StatusCodes.PRECONDITION_FAILED) {
            failedAttempts[userEmail] = (failedAttempts[userEmail] || 0) + 1
            return {
                status: StatusCodes.PRECONDITION_FAILED,
                message: 'Kullanıcı ya da şifre hatalı girildi. Lütfen kontrol ediniz.'
            }
        }

        failedAttempts[userEmail] = 0
        const token = jwt.sign({ email: userEmail }, generateToken(), { expiresIn: '1h' })
        res.cookie('authToken', token, { httpOnly: false, secure: true, sameSite: 'lax' });

        return {
            status: StatusCodes.OK,
            message: 'Login başarılı'
        }
    } catch (error) {
        return {
            status: StatusCodes.INTERNAL_SERVER_ERROR,
            message: 'Error: loginService.login - ${getErrorMessage(error)}'
        }
    }
}

export default {
    login
}
