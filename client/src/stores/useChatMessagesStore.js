import { create } from 'zustand';
import { fetchChatHistory, sendChatMessage } from '../api/chat.service';
import { useAuthStore } from './useAuthStore';

export const useChatMessagesStore = create((set, get) => ({
    messages: [],
    isFetchingHistory: true,
    isLoading: false,
    error: null,

    loadHistory: async () => {
        const token = useAuthStore.getState().token;
        if (!token) {
            set({ isFetchingHistory: false });
            return;
        }

        set({ isFetchingHistory: true, error: null });
        try {
            const data = await fetchChatHistory(token);
            const mappedMessages = [];
            data.forEach(record => {
                mappedMessages.push({ role: 'user', content: record.query });
                mappedMessages.push({ role: 'ai', content: record.answer, sources: record.sources });
            });
            set({ messages: mappedMessages, isFetchingHistory: false });
        } catch (error) {
            console.error('Failed to fetch chat history', error);
            set({ error: 'Failed to load history', isFetchingHistory: false });
        }
    },

    sendMessage: async (query) => {
        const token = useAuthStore.getState().token;
        if (!token) return;

        // Optimistic UI update
        set((state) => ({
            messages: [...state.messages, { role: 'user', content: query }],
            isLoading: true,
            error: null
        }));

        try {
            const data = await sendChatMessage(query, token);
            set((state) => ({
                messages: [...state.messages, { role: 'ai', content: data.answer, sources: data.sources }],
                isLoading: false
            }));
        } catch (error) {
            console.error('Chat error:', error);
            const errData = error.response?.data;
            let errorMessage = errData?.message || 'Sorry, I encountered an error. Please try again.';
            
            if (errData?.errors && Array.isArray(errData.errors)) {
                errorMessage = errData.errors.map(e => e.message).join(', ');
            }
            
            set((state) => ({
                messages: [...state.messages, { role: 'ai', content: errorMessage }],
                isLoading: false,
                error: errorMessage
            }));
        }
    },

    clearChat: () => set({ messages: [], error: null })
}));
