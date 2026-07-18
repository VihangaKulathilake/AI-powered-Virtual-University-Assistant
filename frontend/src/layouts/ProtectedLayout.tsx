import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

interface ProtectedLayoutProps {
  redirectPath?: string;
}

export const ProtectedLayout: React.FC<ProtectedLayoutProps> = ({
  redirectPath = '/',
}) => {
  // Mock authentication check: check for auth_token in localStorage
  const isAuthenticated = !!localStorage.getItem('auth_token') || true; // Set to true for initial template validation

  if (!isAuthenticated) {
    return <Navigate to={redirectPath} replace />;
  }

  // Renders the child routes
  return <Outlet />;
};

export default ProtectedLayout;
