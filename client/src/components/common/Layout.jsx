import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../stores/useAuthStore';
import { LogOut } from 'lucide-react';

const Layout = ({ children }) => {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const role = useAuthStore((state) => state.role);
    const logout = useAuthStore((state) => state.logout);
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // Hide navbar entirely on login/register if desired, but we'll show a simple one.
    const isAuthPage = location.pathname === '/login' || location.pathname === '/register' || location.pathname === '/';

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <nav className="bg-white shadow-sm p-4 px-6 flex justify-between items-center border-b border-gray-200">
                <div className="font-bold text-xl text-indigo-700 tracking-tight">
                    EduRAG<span className="text-gray-400 font-normal">Bot</span>
                </div>
                
                <div className="flex gap-6 items-center">
                    {!isAuthenticated ? (
                        <>
                            <Link to="/login" className="text-gray-600 hover:text-indigo-600 font-medium transition">Login</Link>
                            <Link to="/register" className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 font-medium transition">Sign Up</Link>
                        </>
                    ) : (
                        <>
                            {role === 'Admin' && (
                                <Link to="/admin" className="text-gray-600 hover:text-indigo-600 font-medium transition">Admin Panel</Link>
                            )}
                            {(role === 'Student' || role === 'Guest') && (
                                <Link to="/chat" className="text-gray-600 hover:text-indigo-600 font-medium transition">
                                    {role === 'Guest' ? 'Guest Chat' : 'Student Chat'}
                                </Link>
                            )}
                            
                            <div className="h-6 w-px bg-gray-300 mx-2"></div>
                            
                            <button 
                                onClick={handleLogout}
                                className="flex items-center gap-2 text-red-600 cursor-pointer hover:text-red-700 font-medium transition"
                            >
                                <LogOut className="w-4 h-4" />
                                Logout
                            </button>
                        </>
                    )}
                </div>
            </nav>
            <main className="flex-1 flex flex-col overflow-auto">
                {children}
            </main>
        </div>
    );
};

export default Layout;

