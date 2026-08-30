import api from './axios';

export const fetchChatHistory = async (token) => {
    const { data } = await api.get('/chat/history', {
        headers: { Authorization: `Bearer ${token}` }
    });
    return data;
};

export const sendChatMessage = async (query, token) => {
    const { data } = await api.post('/chat/chat', { query }, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return data;
};
