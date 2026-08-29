import axios from 'axios';

export const fetchChatHistory = async (token) => {
    const { data } = await axios.get('/chat/history', {
        headers: { Authorization: `Bearer ${token}` }
    });
    return data;
};

export const sendChatMessage = async (query, token) => {
    const { data } = await axios.post('/chat/chat', { query }, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return data;
};
