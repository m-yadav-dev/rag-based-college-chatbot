import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../stores/useAuthStore';
import { LogOut, Menu, X } from 'lucide-react';

const Layout = ({ children }) => {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const role = useAuthStore((state) => state.role);
    const logout = useAuthStore((state) => state.logout);
    const navigate = useNavigate();
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        setIsMobileMenuOpen(false);
        navigate('/login');
    };

    const closeMobileMenu = () => setIsMobileMenuOpen(false);

    // Shared nav link content (reused by desktop and mobile menus)
    const NavLinks = ({ className = '' }) => {
        const isLogin = location.pathname === '/login';
        const isRegister = location.pathname === '/register';
        const activeClass = "px-4 py-2 bg-indigo-500/15 text-indigo-700 rounded-lg hover:bg-indigo-500/20 font-medium transition text-center";
        const inactiveClass = "px-4 py-2 text-slate-700 hover:text-indigo-600 hover:bg-white/40 rounded-lg font-medium transition text-center";

        return (
            <div className={className}>
                {!isAuthenticated ? (
                    <>
                        <Link to="/login" onClick={closeMobileMenu} className={isLogin ? activeClass : inactiveClass}>Login</Link>
                        <Link to="/register" onClick={closeMobileMenu} className={isRegister ? activeClass : inactiveClass}>Sign Up</Link>
                    </>
                ) : (
                    <>
                        {role === 'Admin' && (
                            <Link to="/admin" onClick={closeMobileMenu} className="text-slate-700 hover:text-indigo-600 font-medium transition">Admin Panel</Link>
                        )}
                        {(role === 'Student' || role === 'Guest') && (
                            <Link to="/chat" onClick={closeMobileMenu} className="text-slate-700 hover:text-indigo-600 font-medium transition">
                                {role === 'Guest' ? 'Guest Chat' : 'Student Chat'}
                            </Link>
                        )}
                        <div className="hidden md:block h-6 w-px bg-gray-300/50 mx-2"></div>
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
        );
    };

    return (
        <div className="h-dvh bg-gray-50 flex flex-col">
            {/* Glass Header */}
            <nav className="sticky top-0 z-50 bg-white/70 backdrop-blur-md px-4 md:px-6 py-3 flex justify-between items-center border-b border-white/30 shadow-sm flex-shrink-0">
                <div className="font-bold text-lg md:text-xl text-indigo-700 tracking-tight">
                    DocuTutor<span className="text-gray-400 font-normal">Chat</span>
                </div>

                {/* Desktop Nav */}
                <NavLinks className="hidden md:flex gap-4 items-center" />

                {/* Mobile Hamburger */}
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="md:hidden p-2 text-slate-700 hover:text-indigo-600 transition cursor-pointer"
                    aria-label="Toggle menu"
                >
                    {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </nav>

            {/* Glass Mobile Dropdown Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden bg-white/90 backdrop-blur-lg border-b border-white/20 shadow-lg animate-in slide-in-from-top z-40">
                    <NavLinks className="flex flex-col gap-3 px-4 py-4" />
                </div>
            )}

            {/* Main Content */}
            <main className="flex-1 flex flex-col overflow-hidden min-h-0">
                {children}
            </main>
        </div>
    );
};

export default Layout;

