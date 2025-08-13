// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children, role }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!role) {
    // No role specified means route accessible by any logged in user
    return children;
  }

  const allowedRoles = Array.isArray(role) ? role : [role];

  if (!allowedRoles.includes(user.role)) {
    // Redirect to home or dashboard based on role
    if (user.role === 'admin') return <Navigate to="/admin-dashboard" replace />;
    if (user.role === 'member' || user.role === 'user')
      return <Navigate to="/member-dashboard" replace />;
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
