import axios from 'axios';


let rawUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';


if (rawUrl.endsWith('/')) {
    rawUrl = rawUrl.slice(0, -1);
}


const baseURL = rawUrl.endsWith('/api') ? rawUrl : `${rawUrl}/api`;

console.log("🔗 API Connected to:", baseURL); 

const api = axios.create({
    baseURL: baseURL,
    headers: {
        'Content-Type': 'application/json'
    }
});


api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers['x-auth-token'] = token;
    }
    return config;
});

export default api;