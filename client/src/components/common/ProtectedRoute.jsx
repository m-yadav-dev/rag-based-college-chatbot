import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';

const ProtectedRoute = ({ allowedRoles }) => {
    const isAuthenticated = useAppStore((state) => state.isAuthenticated);
    const userRole = useAppStore((state) => state.role);

    if (!isAuthenticated) {
        // Not logged in, redirect to login page
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(userRole)) {
        // Logged in but unauthorized for this specific route.
        // Redirect them to their designated landing page.
        if (userRole === 'Admin') {
            return <Navigate to="/admin/documents" replace />;
        }
        return <Navigate to="/chat" replace />;
    }

    // Authorized, render child routes
    return <Outlet />;
};

export default ProtectedRoute;
