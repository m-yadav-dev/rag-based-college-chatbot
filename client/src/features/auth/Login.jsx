import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAppStore } from '../../store/useAppStore';
import TextInput from '../../components/forms/TextInput';
import Button from '../../components/common/Button';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    const setCredentials = useAppStore((state) => state.setCredentials);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const { data } = await axios.post('/auth/login', { email, password });
            
            // Save to Zustand & localStorage
            setCredentials(data.user, data.token);

            // Redirect based on role
            if (data.user.role === 'Admin') {
                navigate('/admin');
            } else {
                navigate('/chat');
            }
        } catch (err) {
            console.error('Login error', err);
            // Check if it's a Zod validation error or a generic error
            if (err.response?.data?.errors) {
                setError(err.response.data.errors[0].message);
            } else {
                setError(err.response?.data?.message || 'Invalid email or password.');
            }
        } finally {
            setIsLoading(false);
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
