import React, { useEffect } from 'react';
import axios from 'axios';
import { useAppStore } from '../../store/useAppStore';
import MessageList from './components/MessageList';
import ChatInput from './components/ChatInput';

const ChatView = () => {
    const messages = useAppStore((state) => state.messages);
    const isLoading = useAppStore((state) => state.isLoading);
    const addMessage = useAppStore((state) => state.addMessage);
    const setLoading = useAppStore((state) => state.setLoading);
    const clearChat = useAppStore((state) => state.clearChat);
    const initHistory = useAppStore((state) => state.initHistory);
    const token = useAppStore((state) => state.token);
    const [isFetchingHistory, setIsFetchingHistory] = React.useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            if (!token) {
                setIsFetchingHistory(false);
                return;
            }
            try {
                const { data } = await axios.get('/chat/history', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                initHistory(data);
            } catch (error) {
                console.error('Failed to fetch chat history', error);
            } finally {
                setIsFetchingHistory(false);
            }
        };
        fetchHistory();
    }, [token, initHistory]);

    const handleSend = async (query) => {
        // Optimistically add the user's message
        addMessage({ role: 'user', content: query });
        setLoading(true);

        try {
            const { data } = await axios.post('/chat/chat', { query: query }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log("🚀 ~ ChatView ~ data:", data)
            // Append the AI's response with citations
            addMessage({ role: 'ai', content: data.answer, sources: data.sources });
        } catch (error) {
            console.error('Chat error:', error);
            const errData = error.response?.data;
            let errorMessage = errData?.message || 'Sorry, I encountered an error. Please try again.';
            
            // Handle Zod array errors
            if (errData?.errors && Array.isArray(errData.errors)) {
                errorMessage = errData.errors.map(e => e.message).join(', ');
            }
            
            addMessage({ role: 'ai', content: errorMessage });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative h-[calc(100vh-65px)] bg-gray-50 flex flex-col items-center overflow-hidden w-full">
            <div className="w-full md:w-3/4 lg:max-w-4xl mx-auto flex flex-col flex-1 overflow-hidden relative">
                {isFetchingHistory ? (
                    <div className="flex-1 p-6 space-y-6 overflow-y-auto">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="animate-pulse flex space-x-4">
                                <div className="rounded-full bg-gray-200 h-10 w-10"></div>
                                <div className="flex-1 space-y-4 py-1">
                                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                    <div className="space-y-2">
                                        <div className="h-4 bg-gray-200 rounded"></div>
                                        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <>
                        <MessageList messages={messages} isLoading={isLoading} />
                        {isLoading && (
                            <div className="px-6 py-2 text-sm text-indigo-500 italic animate-pulse flex items-center gap-2 bg-white/50 backdrop-blur-sm border-t border-gray-100">
                                <span className="w-4 h-4 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin"></span>
                                ✨ Generating answer...
                            </div>
                        )}
                        <ChatInput onSend={handleSend} isLoading={isLoading} />
                    </>
                )}
            </div>
        </div>
    );
};

export default ChatView;
