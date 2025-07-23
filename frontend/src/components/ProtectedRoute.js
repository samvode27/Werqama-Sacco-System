import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children, role }) => {
    const { user, loading } = useAuth();

    if (loading) return <div>Loading...</div>;

    if (!user) {
        console.log('User not authenticated, redirecting to login.');
        return <Navigate to="/login" />;
    }

    if (role && user.role !== role) {
        console.log('User lacks required role, redirecting to home.');
        return <Navigate to="/" />;
    }

    return children;
};

export default ProtectedRoute;
