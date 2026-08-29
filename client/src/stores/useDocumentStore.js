import { create } from 'zustand';
import { getDocumentsService, uploadDocumentService, deleteDocumentService } from '../api/document.service';
import { useAuthStore } from './useAuthStore';

export const useDocumentStore = create((set) => ({
    documents: [],
    isLoading: false,
    isUploading: false,
    error: null,

    loadDocuments: async () => {
        const token = useAuthStore.getState().token;
        if (!token) return;
        
        set({ isLoading: true, error: null });
        try {
            const data = await getDocumentsService(token);
            set({ documents: data, isLoading: false });
        } catch (error) {
            set({ error: 'Failed to load documents.', isLoading: false });
        }
    },

    addDocument: async (title, file) => {
        const token = useAuthStore.getState().token;
        if (!token) return;

        set({ isUploading: true, error: null });
        const formData = new FormData();
        formData.append('title', title);
        formData.append('file', file);

        try {
            const data = await uploadDocumentService(formData, token);
            set((state) => ({ 
                documents: [data.document, ...state.documents], 
                isUploading: false 
            }));
            return data;
        } catch (error) {
            let errorMsg = 'Failed to upload document.';
            if (error.response?.data?.errors) {
                errorMsg = error.response.data.errors.map(e => e.message).join(', ');
            } else if (error.response?.data?.message) {
                errorMsg = error.response.data.message;
            }
            set({ error: errorMsg, isUploading: false });
            throw new Error(errorMsg);
        }
    },

    removeDocument: async (id) => {
        const token = useAuthStore.getState().token;
        if (!token) return;
        
        try {
            await deleteDocumentService(id, token);
            set((state) => ({
                documents: state.documents.filter(d => d._id !== id)
            }));
        } catch (error) {
            console.error('Failed to delete document', error);
        }
    }
}));
