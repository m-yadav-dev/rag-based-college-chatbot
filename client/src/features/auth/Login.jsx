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
    const guestLogin = useAuthStore((state) => state.guestLogin);
    const isLoading = useAuthStore((state) => state.isLoading);
    const error = useAuthStore((state) => state.error);
    const clearError = useAuthStore((state) => state.clearError);
    const isGuestLoggedIn = useAuthStore((state) => state.isGuestLoggedIn);
    const navigate = useNavigate();

    // Clear any lingering errors on mount
    useEffect(() => {
        clearError();
    }, [clearError]);

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const success = await login({ email, password });
            if (success) {
                const { role } = useAuthStore.getState();
                navigate(role === 'Admin' ? '/admin' : '/chat');
            }
        } catch (err) {
            console.error('Login submission failed:', err.message);
        }
    };

    const handleGuestLogin = async () => {
        try {
            const success = await guestLogin();
            if (success) {
                navigate('/chat');
            }
        } catch (err) {
            console.error('Guest login submission failed:', err.message);
        }
    };

    return (
        <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('/auth-bg.jpg')" }}>
            <div className="w-full max-w-md bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/30 p-6 sm:p-8">
                <div className="text-center mb-8">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Welcome Back</h1>
                    <p className="text-gray-500 mt-2 text-sm sm:text-base">Log in to access your dashboard.</p>
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
                        className="w-full mt-2 cursor-pointer"
                    >
                        Sign In
                    </Button>
                </form>

                <div className="relative mt-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300/50"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white/80 text-gray-500 rounded">Or</span>
                    </div>
                </div>
                
                <button
                    type="button"
                    onClick={handleGuestLogin}
                    disabled={isGuestLoggedIn}
                    className="w-full mt-6 cursor-pointer flex justify-center py-2.5 px-4 border-2 border-indigo-600 rounded-xl shadow-sm text-sm font-medium text-indigo-600 bg-white/70 hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    {isGuestLoggedIn ? 'Setting up Guest...' : 'Continue as Guest (24h Access)'}
                </button>

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

