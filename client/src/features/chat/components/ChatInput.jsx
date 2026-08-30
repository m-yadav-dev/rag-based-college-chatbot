import React, { useState } from 'react';
import { SendHorizontal } from 'lucide-react';

const ChatInput = ({ onSend, isLoading }) => {
    const [query, setQuery] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (query.trim() && !isLoading) {
            onSend(query.trim());
            setQuery('');
        }
    };

    return (
        <div className="w-full bg-white p-3 sm:p-4 border-t border-gray-200 mt-auto flex-shrink-0"
             style={{ paddingBottom: `max(0.75rem, env(safe-area-inset-bottom))` }}
        >
            <div className="max-w-4xl mx-auto">
                <form 
                    onSubmit={handleSubmit}
                    className="flex items-end gap-2 bg-white border border-gray-200 shadow-sm rounded-2xl p-1.5 sm:p-2 transition-shadow focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500 focus-within:shadow-md"
                >
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Ask about the college..."
                        disabled={isLoading}
                        className="flex-1 min-w-0 max-h-32 px-3 sm:px-4 py-2.5 sm:py-3 bg-transparent border-none outline-none resize-none disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base text-gray-700"
                    />
                    <button
                        type="submit"
                        disabled={!query.trim() || isLoading}
                        className="p-2.5 sm:p-3.5 bg-indigo-600 text-white rounded-xl cursor-pointer hover:bg-indigo-700 disabled:opacity-50 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed transition-all active:scale-95 disabled:active:scale-100 flex-shrink-0"
                    >
                        <SendHorizontal className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                </form>
                <div className="text-center mt-1.5 sm:mt-2">
                    <span className="text-[10px] sm:text-xs text-gray-400">AI can make mistakes. Information is strictly retrieved from the uploaded knowledge base.</span>
                </div>
            </div>
        </div>
    );
};

export default ChatInput;

