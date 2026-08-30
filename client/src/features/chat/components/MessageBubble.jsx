import React from 'react';
import { Bot, User, BookOpen } from 'lucide-react';

const MessageBubble = ({ role, content, sources }) => {
    const isAi = role === 'ai';

    return (
        <div className={`flex w-full ${isAi ? 'justify-start' : 'justify-end'} mb-6`}>
            <div className={`flex max-w-[85%] sm:max-w-[75%] gap-3 sm:gap-4 ${isAi ? 'flex-row' : 'flex-row-reverse'}`}>
                
                {/* Avatar */}
                <div className="flex-shrink-0">
                    <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shadow-sm ${
                        isAi ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-800 text-white'
                    }`}>
                        {isAi ? <Bot className="w-5 h-5 sm:w-6 sm:h-6" /> : <User className="w-4 h-4 sm:w-5 sm:h-5" />}
                    </div>
                </div>

                {/* Message Content */}
                <div className="flex flex-col gap-2 min-w-0">
                    {/* Source Badges — above the text for AI messages */}
                    {isAi && sources && sources.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                            {sources.map((source, idx) => (
                                <span 
                                    key={idx}
                                    className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-indigo-50 text-indigo-600 border border-indigo-100 rounded-full text-xs font-medium cursor-default select-none"
                                    title={source.title}
                                >
                                    <BookOpen className="w-3 h-3 flex-shrink-0" />
                                    <span className="truncate max-w-[180px]">{source.title}</span>
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Text Bubble */}
                    <div className={`px-4 sm:px-5 py-3 sm:py-3.5 rounded-2xl ${
                        isAi 
                            ? 'bg-white border border-gray-100 text-gray-800 shadow-sm rounded-tl-sm' 
                            : 'bg-indigo-600 text-white rounded-tr-sm'
                    }`}>
                        <p className="whitespace-pre-wrap leading-relaxed text-sm sm:text-base">
                            {content}
                        </p>
                    </div>
                </div>
                
            </div>
        </div>
    );
};

export default MessageBubble;

