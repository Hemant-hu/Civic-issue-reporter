import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, role }) => {
  const { user } = useAuth();

  if (!user) {
    // If not logged in, redirect to login page
    return <Navigate to="/login" />;
  }

  if (role && user.role !== role) {
    // If logged in but role doesn't match, redirect to home
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;
