import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/useAuthStore';
import TextInput from '../../components/forms/TextInput';
import Button from '../../components/common/Button';

const Login = () => {
    // Local form state only
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    // Global state subscriptions
    const login = useAuthStore((state) => state.login);
    const isLoading = useAuthStore((state) => state.isLoading);
    const error = useAuthStore((state) => state.error);
    const clearError = useAuthStore((state) => state.clearError);
    
    const navigate = useNavigate();

    // Clear any lingering errors on mount
    useEffect(() => {
        clearError();
    }, [clearError]);

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const data = await login({ email, password });
            if (data.user.role === 'Admin') {
                navigate('/admin');
            } else {
                navigate('/chat');
            }
        } catch (err) {
            // Error is handled natively by the store and reflected in the UI via the 'error' state
            console.error('Login submission failed:', err.message);
        }
    };

    return (
        <div className="flex-1 flex flex-col items-center justify-center p-6 bg-gray-50">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Welcome Back</h1>
                    <p className="text-gray-500 mt-2">Log in to access your dashboard.</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-5">
                    {error && (
                        <div className="p-3 text-sm bg-red-50 text-red-600 rounded-lg border border-red-100">
                            {error}
                        </div>
                    )}
                    
                    <TextInput
                        label="Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="john@example.com"
                        disabled={isLoading}
                    />
                    
                    <TextInput
                        label="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        disabled={isLoading}
                        type="password"
                    />
                    
                    <Button 
                        type="submit" 
                        isLoading={isLoading} 
                        loadingText="Authenticating..."
                        className="w-full mt-2"
                    >
                        Sign In
                    </Button>
                </form>

                <div className="mt-6 text-center text-sm text-gray-600">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-indigo-600 font-medium hover:underline">
                        Create one now
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
