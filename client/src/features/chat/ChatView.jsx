import React, { useEffect } from 'react';
import { useChatMessagesStore } from '../../stores/useChatMessagesStore';
import MessageList from './components/MessageList';
import ChatInput from './components/ChatInput';
import { AlertCircle, X } from 'lucide-react';

const ChatView = () => {
    // Global state subscriptions
    const messages = useChatMessagesStore((state) => state.messages);
    const isLoading = useChatMessagesStore((state) => state.isLoading);
    const isFetchingHistory = useChatMessagesStore((state) => state.isFetchingHistory);
    const error = useChatMessagesStore((state) => state.error);
    const loadHistory = useChatMessagesStore((state) => state.loadHistory);
    const sendMessage = useChatMessagesStore((state) => state.sendMessage);
    const clearError = useChatMessagesStore((state) => state.clearError);

    useEffect(() => {
        loadHistory();
    }, [loadHistory]);

    return (
        <div className="flex-1 bg-slate-50/80 flex flex-col items-center overflow-hidden w-full">
            <div className="w-full md:w-3/4 lg:max-w-4xl mx-auto flex flex-col flex-1 overflow-hidden min-h-0 relative">
                {isFetchingHistory ? (
                    <div className="flex-1 p-4 sm:p-6 space-y-6 overflow-y-auto">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="animate-pulse flex space-x-4">
                                <div className="rounded-full bg-gray-200 h-8 w-8 sm:h-10 sm:w-10"></div>
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

                        {error && (
                            <div className="mx-4 sm:mx-6 my-2 bg-red-50 text-red-700 border border-red-200 p-3 rounded-lg flex items-start sm:items-center justify-between text-sm shadow-sm flex-shrink-0 z-10">
                                <div className="flex items-center gap-2">
                                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                    <span>{error}</span>
                                </div>
                                <button 
                                    onClick={clearError}
                                    className="p-1 hover:bg-red-100 rounded-md transition-colors ml-4 flex-shrink-0 cursor-pointer"
                                >
                                    <X className="w-4 h-4" />
                                </button>
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
