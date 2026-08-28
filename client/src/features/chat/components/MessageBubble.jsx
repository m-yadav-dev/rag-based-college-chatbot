import React from 'react';
import { Bot, User, FileText } from 'lucide-react';

const MessageBubble = ({ role, content, sources }) => {
    const isAi = role === 'ai';

    return (
        <div className={`flex w-full ${isAi ? 'justify-start' : 'justify-end'} mb-6`}>
            <div className={`flex max-w-[85%] sm:max-w-[75%] gap-4 ${isAi ? 'flex-row' : 'flex-row-reverse'}`}>
                
                {/* Avatar */}
                <div className="flex-shrink-0">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-sm ${
                        isAi ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-800 text-white'
                    }`}>
                        {isAi ? <Bot className="w-6 h-6" /> : <User className="w-5 h-5" />}
                    </div>
                </div>

                {/* Message Content */}
                <div className="flex flex-col space-y-2 max-w-full">
                    <div className={`px-5 py-3.5 rounded-2xl ${
                        isAi 
                            ? 'bg-white border border-gray-100 text-gray-800 shadow-sm rounded-tl-sm' 
                            : 'bg-indigo-600 text-white rounded-tr-sm'
                    }`}>
                        <p className="whitespace-pre-wrap leading-relaxed text-sm sm:text-base">
                            {content}
                        </p>
                    </div>

                    {/* Source Citations for AI */}
                    {isAi && sources && sources.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-1">
                            {sources.map((source, idx) => (
                                <a 
                                    key={idx} 
                                    href={source.url} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 hover:bg-green-100 border border-green-200 rounded-full text-xs font-medium transition-all cursor-pointer hover:shadow-sm active:scale-95"
                                    title={`View document: ${source.title}`}
                                >
                                    <FileText className="w-3.5 h-3.5 flex-shrink-0" />
                                    <span className="truncate max-w-[200px]">{source.title}</span>
                                </a>
                            ))}
                        </div>
                    )}
                </div>
                
            </div>
        </div>
    );
};

export default MessageBubble;
