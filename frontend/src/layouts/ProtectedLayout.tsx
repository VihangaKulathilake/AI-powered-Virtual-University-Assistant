import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';

interface ProtectedLayoutProps {
  redirectPath?: string;
}

export const ProtectedLayout: React.FC<ProtectedLayoutProps> = ({
  redirectPath = '/login',
}) => {
  const { isAuthenticated, isLoading } = useAuth();

  // Wait until session is restored from localStorage before redirecting
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={redirectPath} replace />;
  }

  return <Outlet />;
};

export default ProtectedLayout;
