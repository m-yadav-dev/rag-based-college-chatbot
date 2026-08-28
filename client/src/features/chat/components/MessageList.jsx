import React, { useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';

const MessageList = ({ messages, isLoading }) => {
    const bottomRef = useRef(null);

    // Auto-scroll to bottom when messages update
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isLoading]);

    if (messages.length === 0) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 space-y-4 text-gray-400">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm">
                    <span className="text-2xl">🎓</span>
                </div>
                <div>
                    <h3 className="text-lg font-medium text-gray-700">Ask me anything!</h3>
                    <p className="text-sm max-w-sm mt-1">I can answer questions based on the college documents uploaded to the system.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 pb-4 custom-scrollbar">
            <div className="max-w-4xl mx-auto flex flex-col">
                {messages.map((msg, index) => (
                    <MessageBubble 
                        key={index} 
                        role={msg.role} 
                        content={msg.content} 
                        sources={msg.sources} 
                    />
                ))}
                
                {isLoading && (
                    <div className="flex justify-start mb-6 animate-pulse">
                        <div className="flex max-w-[85%] gap-4">
                            <div className="w-10 h-10 rounded-full bg-indigo-100 flex-shrink-0"></div>
                            <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-sm px-6 py-4 shadow-sm">
                                <div className="flex gap-1.5 items-center h-full">
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                
                {/* Invisible element to scroll to */}
                <div ref={bottomRef} className="h-4" />
            </div>
        </div>
    );
};

export default MessageList;
