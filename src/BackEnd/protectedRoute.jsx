import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ requiredRole }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  const userData = JSON.parse(localStorage.getItem('userData') || '{}');
  const location = useLocation();

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  // If role is required and user doesn't have that role, redirect to appropriate dashboard
  if (requiredRole && userData.rol !== requiredRole) {
    if (userData.rol === 'Administrador') {
      return <Navigate to="/admin_inicio" replace />;
    } else if (userData.rol === 'Alimentador') {
      return <Navigate to="/alimentador_inicio" replace />;
    }
    // Default fallback
    return <Navigate to="/" replace />;
  }

  // Allow access to the route
  return <Outlet />;
};

export default ProtectedRoute;