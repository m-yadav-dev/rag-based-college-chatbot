import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAppStore } from '../../store/useAppStore';
import TextInput from '../../components/forms/TextInput';
import Button from '../../components/common/Button';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('Student');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    const setCredentials = useAppStore((state) => state.setCredentials);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const { data } = await axios.post('/auth/register', { name, email, password, role });
            
            // Save to Zustand & localStorage
            setCredentials(data.user, data.token);

            // Redirect based on role
            if (data.user.role === 'Admin') {
                navigate('/admin');
            } else {
                navigate('/chat');
            }
        } catch (err) {
            console.error('Registration error', err);
            // Handle Zod array errors or generic message
            if (err.response?.data?.errors) {
                setError(err.response.data.errors[0].message);
            } else {
                setError(err.response?.data?.message || 'Failed to register account.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex-1 flex flex-col items-center justify-center p-6 bg-gray-50">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Create Account</h1>
                    <p className="text-gray-500 mt-2">Join the college chatbot platform.</p>
                </div>

                <form onSubmit={handleRegister} className="space-y-5">
                    {error && (
                        <div className="p-3 text-sm bg-red-50 text-red-600 rounded-lg border border-red-100">
                            {error}
                        </div>
                    )}
                    
                    <TextInput
                        label="Full Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="John Doe"
                        disabled={isLoading}
                    />

                    <TextInput
                        label="Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="john@example.com"
                        disabled={isLoading}
                    />
                    
                    {/* Wait, TextInput uses type="text", but password should use type="password". 
                        We will adapt TextInput or just use native input here for password security. */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            disabled={isLoading}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Account Role</label>
                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            disabled={isLoading}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-white"
                        >
                            <option value="Student">Student (Access Chat)</option>
                            <option value="Admin">Admin (Access Document Manager)</option>
                        </select>
                    </div>
                    
                    <Button 
                        type="submit" 
                        isLoading={isLoading} 
                        loadingText="Creating account..."
                        className="w-full mt-2"
                    >
                        Sign Up
                    </Button>
                </form>

                <div className="mt-6 text-center text-sm text-gray-600">
                    Already have an account?{' '}
                    <Link to="/login" className="text-indigo-600 font-medium hover:underline">
                        Sign in instead
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Register;
