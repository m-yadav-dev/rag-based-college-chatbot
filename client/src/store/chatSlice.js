export const createChatSlice = (set) => ({
    messages: [],
    isLoading: false,
    error: null,

    initHistory: (historyArray) => {
        const mappedMessages = [];
        historyArray.forEach(record => {
            mappedMessages.push({ role: 'user', content: record.query });
            mappedMessages.push({ role: 'ai', content: record.answer, sources: record.sources });
        });
        set({ messages: mappedMessages });
    },

    addMessage: (message) => set((state) => ({
        messages: [...state.messages, message]
    })),

    setLoading: (isLoading) => set({ isLoading }),
    
    setError: (error) => set({ error }),

    clearChat: () => set({ messages: [], error: null })
});
