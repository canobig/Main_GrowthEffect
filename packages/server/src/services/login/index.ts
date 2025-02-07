import { StatusCodes } from 'http-status-codes'
import { utilLogIn } from '../../utils/login'
import jwt from 'jsonwebtoken';
import { Response } from 'express';

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
                message: 'Kullanıcı ya da şifre girişi yapılmalıdır.!'
            }
        }

        const userResponse = await utilLogIn(userEmail, userPass)

        if (userResponse === StatusCodes.INTERNAL_SERVER_ERROR) {
            return {
                status: StatusCodes.INTERNAL_SERVER_ERROR,
                message: 'Login işlemi sırasında bir hata oluştu. Lütfen yönetici ile iletişime geçiniz.'
            }
        } else if (userResponse === StatusCodes.PRECONDITION_FAILED) {
            return {
                    status: StatusCodes.PRECONDITION_FAILED,
                    message: 'Kullanıcı ya da şifre hatalı girildi. Lütfen kontrol ediniz.'
                }
        } else if (userResponse === StatusCodes.FORBIDDEN) {
            return {
                     status: StatusCodes.PRECONDITION_FAILED,
                     message: 'Hesap, çok fazla başarısız giriş denemesi nedeniyle kilitlendi. Lütfen daha sonra tekrar deneyin.'
                }
        } 

        const token = jwt.sign({ email: userEmail }, generateToken(), { expiresIn: '1h' })
        res.cookie('authToken', token, { 
            httpOnly: true, 
            secure: false, 
            sameSite: 'lax', 
            maxAge: 24 * 60 * 60 * 1000 });

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
