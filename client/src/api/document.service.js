import axios from 'axios';

export const getDocumentsService = async (token) => {
    const { data } = await axios.get('/documents', {
        headers: { Authorization: `Bearer ${token}` }
    });
    return data;
};

export const uploadDocumentService = async (formData, token) => {
    const { data } = await axios.post('/documents/upload', formData, {
        headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
        }
    });
    return data;
};

export const deleteDocumentService = async (id, token) => {
    const { data } = await axios.delete(`/documents/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return data;
};
