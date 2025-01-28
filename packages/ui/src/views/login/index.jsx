import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import logo from '@/assets/images/growtheffect-logo-big-Black-300x129.png'
import logoDark from '@/assets/images/growtheffect-logo-big-White-300x129.png'
import './login.css'
import loginApi from '@/api/login'


const MIN_PASSWORD_LENGTH = 8;
const MAX_PASSWORD_LENGTH = 12;

const Login = () => {
    const [isDarkMode, setIsDarkMode] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPass] = useState('')
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

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
            navigate('/');
            setMessage(response.data.message)

        } catch (error) {
            setMessage('Login API error:'+ error)
        }
    }

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
                <div className='message'>
                    {message}    
                </div>
                {/* <p>
                    Don't have an account? <a href='/signup'>Sign Up</a>
                </p> */}
            </div>
        </div>
    )
}

export default Login
