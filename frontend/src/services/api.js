import axios from 'axios';

// 1. Create a central client
const api = axios.create({
    
    baseURL: '/api', 
    headers: {
        'Content-Type': 'application/json',
    },
});

// 2. Add The "Interceptor" (The Middleware)
api.interceptors.request.use(
    (config) => {
        // Check if token exists in browser storage
        const token = localStorage.getItem('token');
        if (token) {
            // Attach it to the header: "Authorization: Bearer xyz..."
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;