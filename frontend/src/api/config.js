import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000', // Change this to match your backend URL
    timeout: 30000, // Extended timeout for file uploads
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to attach auth token to all requests
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        // Don't modify content-type for FormData (file uploads)
        if (config.data instanceof FormData) {
            delete config.headers['Content-Type'];
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Add a response interceptor for handling common errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Handle unauthorized access
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/';
        }
        return Promise.reject(error);
    }
);

export default api;