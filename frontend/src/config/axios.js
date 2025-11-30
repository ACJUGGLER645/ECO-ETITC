import axios from 'axios';

// Create an axios instance with a dynamic base URL
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || '/',
    withCredentials: true, // Important for cookies/sessions
    headers: {
        'Content-Type': 'application/json',
    }
});

export default api;
