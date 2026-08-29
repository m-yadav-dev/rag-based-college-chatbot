import React, { useEffect } from 'react';
import { useChatMessagesStore } from '../../stores/useChatMessagesStore';
import MessageList from './components/MessageList';
import ChatInput from './components/ChatInput';

const ChatView = () => {
    // Global state subscriptions
    const messages = useChatMessagesStore((state) => state.messages);
    const isLoading = useChatMessagesStore((state) => state.isLoading);
    const isFetchingHistory = useChatMessagesStore((state) => state.isFetchingHistory);
    const loadHistory = useChatMessagesStore((state) => state.loadHistory);
    const sendMessage = useChatMessagesStore((state) => state.sendMessage);

    useEffect(() => {
        loadHistory();
    }, [loadHistory]);

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
                            <div className="px-6 py-2 text-sm text-indigo-500 italic animate-pulse flex items-center gap-2 bg-white/50 backdrop-blur-sm border-t border-gray-100 flex-shrink-0 z-10">
                                <span className="w-4 h-4 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin"></span>
                                ✨ Generating answer...
                            </div>
                        )}
                        <ChatInput onSend={sendMessage} isLoading={isLoading} />
                    </>
                )}
            </div>
        </div>
    );
};

export default ChatView;
