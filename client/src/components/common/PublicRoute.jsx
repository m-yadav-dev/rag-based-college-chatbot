import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';

const PublicRoute = () => {
    const isAuthenticated = useAppStore((state) => state.isAuthenticated);
    const userRole = useAppStore((state) => state.role);

    if (isAuthenticated) {
        // Logged in, redirect away from public routes (like login/register)
        if (userRole === 'Admin') {
            return <Navigate to="/admin/documents" replace />;
        }
        return <Navigate to="/chat" replace />;
    }

    // Not logged in, allow access to public routes
    return <Outlet />;
};

export default PublicRoute;
