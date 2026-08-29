import axios from 'axios';

export const loginService = async (credentials) => {
    const response = await axios.post('/auth/login', credentials);
    return response.data;
};

export const registerService = async (userData) => {
    const response = await axios.post('/auth/register', userData);
    return response.data;
};
