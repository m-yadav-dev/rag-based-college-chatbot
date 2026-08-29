import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL
});

export const getDocumentsService = async (token) => {
    const { data } = await api.get('/documents', {
        headers: { Authorization: `Bearer ${token}` }
    });
    return data;
};

export const uploadDocumentService = async (formData, token) => {
    const { data } = await api.post('/documents/upload', formData, {
        headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
        }
    });
    return data;
};

export const deleteDocumentService = async (id, token) => {
    const { data } = await api.delete(`/documents/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return data;
};

export const renameDocumentService = async (id, newTitle, token) => {
    console.log(`New Title for ${id} is: ${newTitle}`)
    const { data } = await api.patch(`/documents/${id}/rename`, { title: newTitle }, {
        headers: { Authorization: `Bearer ${token}` }
    });
    console.log(`The data is: ${data}`)
    return data;
};
