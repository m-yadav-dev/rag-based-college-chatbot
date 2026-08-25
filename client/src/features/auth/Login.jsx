import React from 'react';
import { Link } from 'react-router-dom';

const Login = () => {
    return (
        <div className="flex flex-col items-center justify-center p-12 space-y-4">
            <h1 className="text-3xl font-bold text-gray-900">Welcome to College Chatbot</h1>
            <p className="text-gray-600">This is a placeholder for the Login/Home page.</p>
            <div className="flex gap-4 mt-6">
                <Link to="/chat" className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">Go to Chat</Link>
                <Link to="/admin" className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition">Go to Admin</Link>
            </div>
        </div>
    );
};

export default Login;
