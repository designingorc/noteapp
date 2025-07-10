import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api', // Your backend API URL
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor to add JWT to requests
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['x-auth-token'] = token;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor for response errors (e.g., 401 Unauthorized)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Optionally, redirect to login or clear token
            localStorage.removeItem('token');
            window.location.href = '/login'; // Redirect to login page
        }
        return Promise.reject(error);
    }
);

export default api;