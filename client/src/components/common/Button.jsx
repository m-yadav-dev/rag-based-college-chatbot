import React from 'react';
import { Loader2 } from 'lucide-react';

const Button = ({ type = 'button', children, disabled, isLoading, loadingText, icon: Icon, onClick, className = '' }) => {
    return (
        <button
            type={type}
            disabled={disabled || isLoading}
            onClick={onClick}
            className={`w-full sm:w-auto px-6 py-2.5 bg-indigo-600 cursor-pointer text-white font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors ${className}`}
        >
            {isLoading ? (
                <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {loadingText || 'Loading...'}
                </>
            ) : (
                <>
                    {Icon && <Icon className="w-4 h-4" />}
                    {children}
                </>
            )}
        </button>
    );
};

export default Button;
