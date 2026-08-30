import api from './axios';

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
