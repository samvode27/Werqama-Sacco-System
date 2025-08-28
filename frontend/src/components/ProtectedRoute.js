// src/components/ProtectedRoute.js
import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import LoadingScreen from "./LoadingScreen";

const ProtectedRoute = ({ children, role }) => {
  const { currentUser } = useSelector((state) => state.user);
  const rehydrated = useSelector((state) => state._persist?.rehydrated);

  if (!rehydrated) return <LoadingScreen />;

  if (!currentUser) return <Navigate to="/login" replace />;

  const userRole = currentUser.role;
  const membershipStatus = currentUser.membershipStatus;

  // Handle role + membershipStatus
  if (role) {
    const allowedRoles = Array.isArray(role) ? role : [role];

    // Member routes
    if (allowedRoles.includes("member")) {
      if (userRole === "user" && membershipStatus === "pending") {
        // User submitted membership → redirect to membership form
        return <Navigate to="/membership-form" replace />;
      }

      if (userRole !== "member" || membershipStatus !== "approved") {
        // Not yet approved → force membership form
        return <Navigate to="/membership-form" replace />;
      }
    }

    // Admin routes
    if (allowedRoles.includes("admin") && userRole !== "admin") {
      return <Navigate to="/" replace />;
    }

    // Generic role mismatch fallback
    if (!allowedRoles.includes(userRole)) {
      if (userRole === "admin") return <Navigate to="/admin-dashboard" replace />;
      if (userRole === "member") return <Navigate to="/member-dashboard" replace />;
      return <Navigate to="/" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
