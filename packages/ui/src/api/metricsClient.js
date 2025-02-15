import axios from 'axios'
import { baseURL } from '@/store/constant'

const metricsClient = axios.create({
    baseURL: `${baseURL}/api/metrics`,
    headers: {
        'Content-type': 'application/json'
    }
})

// Add authorization token if available
metricsClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('authToken')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

// Handle response errors
metricsClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            // Handle specific error cases
            switch (error.response.status) {
                case 401:
                    // Unauthorized - redirect to login or refresh token
                    console.error('Unauthorized access')
                    break
                case 403:
                    // Forbidden
                    console.error('Access forbidden')
                    break
                case 429:
                    // Rate limited
                    console.error('Too many requests')
                    break
                default:
                    console.error('API Error:', error.response.data)
            }
        }
        return Promise.reject(error)
    }
)

export default metricsClient 