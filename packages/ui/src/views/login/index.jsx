import { useState } from 'react'
import logo from '@/assets/images/growtheffect-logo-big-Black-300x129.png'
import logoDark from '@/assets/images/growtheffect-logo-big-White-300x129.png'
import './login.css'
import loginApi from '@/api/login'
import { StatusCodes } from 'http-status-codes'


const MIN_PASSWORD_LENGTH = 8;
const MAX_PASSWORD_LENGTH = 12;

const Login = () => {
    const [isDarkMode, setIsDarkMode] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPass] = useState('')
    const [message, setMessage] = useState('');

    const toggleTheme = () => {
        setIsDarkMode((prevMode) => !prevMode)
    }

    const OnClickLogin = async (e) => {
        e.preventDefault()
        try {
            const obj = {
                email: email,
                password: password
            }

            const response = await loginApi.login(obj)
            if (response.data.status == StatusCodes.OK)
                window.location.href = "/";
            setMessage(response.data.message)

        } catch (error) {
            setMessage('Login API error:'+ error)
        }
    }

    const handleForgotPassword = () => {
        window.open ('https://www.growtheffect.co/forgot_password','_blank');
    };

    return (
        <div className={`background ${isDarkMode ? 'night-mode' : 'day-mode'}`}>
            <div className='mode-toggle'>
                <label className='switch'>
                    <input type='checkbox' onChange={toggleTheme} checked={isDarkMode} />
                    <span className='slider'></span>
                </label>
            </div>
            <div className='login-container'>
                <h2>Welcome</h2>
                <div className='logo'>
                    <img src={isDarkMode ? logoDark : logo} alt='GrowthEffect Logo' />
                </div>
                <form onSubmit={OnClickLogin}>
                    <input
                        type='email'
                        name='email'
                        placeholder='Email'
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        type='password'
                        name='password'
                        placeholder='Password'
                        required
                        minLength={MIN_PASSWORD_LENGTH}
                        maxLength={MAX_PASSWORD_LENGTH}
                        value={password}
                        onChange={(e) => setPass(e.target.value)}
                    />
                    <button type='submit'>Login</button>
                </form>
                <button className="forgot-password-btn" onClick={handleForgotPassword}>
                    Forgot Password
                </button>
                <div className='message'>
                    {message}
                </div>
            </div>
        </div>
    )
}

export default Login
