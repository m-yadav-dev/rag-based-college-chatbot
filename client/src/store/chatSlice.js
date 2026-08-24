export const createChatSlice = (set) => ({
    messages: [],
    isLoading: false,

    addMessage: (message) => set((state) => ({
        messages: [...state.messages, message]
    })),

    setLoading: (isLoading) => set({ isLoading }),

    clearChat: () => set({ messages: [] })
});
