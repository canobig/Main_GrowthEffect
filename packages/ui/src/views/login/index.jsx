import { useState } from 'react'
import logo from '@/assets/images/growtheffect-logo-big-Black-300x129.png'
import logoDark from '@/assets/images/growtheffect-logo-big-White-300x129.png'
import './login.css'
// API
import loginApi from '@/api/login'

const Login = () => {
    const [isDarkMode, setIsDarkMode] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPass] = useState('')

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

            if (response.status === 200) {
                console.log('Login successful:', response.data)
            } else {
                console.error('Login failed with status:', response.status)
            }
        } catch (error) {
            console.error('Login API error:', error)
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
                        value={password}
                        onChange={(e) => setPass(e.target.value)}
                    />
                    <button type='submit'>Login</button>
                </form>
                <p>
                    Don't have an account? <a href='/signup'>Sign Up</a>
                </p>
            </div>
        </div>
    )
}

export default Login
