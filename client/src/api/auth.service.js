import axios from 'axios';

// Instantiating a local instance binds the environment variable immediately
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL
});

export const loginService = async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
};

export const registerService = async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
};

export const guestLoginRequest = async () => {
    const response = await api.post('/auth/guest-login');
    return response.data;
};
