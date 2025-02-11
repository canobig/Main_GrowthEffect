import axios from 'axios';

const getBaseURL = () => {
    if (process.env.NODE_ENV === 'development') {
        // Try ports in sequence until one works
        const ports = [3000, 3001, 3002, 3003];
        return Promise.any(
            ports.map(port => 
                axios.get(`http://localhost:${port}/api/v1/health`)
                    .then(() => `http://localhost:${port}`)
            )
        );
    }
    return Promise.resolve('/');
};

let api = null;

const createApi = async () => {
    const baseURL = await getBaseURL();
    return axios.create({
        baseURL,
        timeout: 30000,
        headers: {
            'Content-Type': 'application/json'
        }
    });
};

// Initialize API with proper base URL
createApi().then(instance => {
    api = instance;
});

// Add request interceptor for debugging
const requestInterceptor = (config) => {
    console.log('API Request:', {
        method: config.method,
        url: config.url,
        headers: config.headers
    });
    return config;
};

const errorInterceptor = (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
};

// Export a function that ensures API is initialized
export const getApi = async () => {
    if (!api) {
        api = await createApi();
        api.interceptors.request.use(requestInterceptor, errorInterceptor);
    }
    return api;
};

export default getApi; 