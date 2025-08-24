import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedAdminRouteProps {
  children: React.ReactNode;
}

function ProtectedAdminRoute({ children }: ProtectedAdminRouteProps) {
  const { user, isAuthenticated } = useAuth();

  // Check if user is authenticated and has admin email
  if (!isAuthenticated || !user) {
    // Redirect to sign in if not authenticated
    return <Navigate to="/signin" replace />;
  }

  if (user.email !== 'admin@gmail.com') {
    // Redirect to home if not admin
    return <Navigate to="/" replace />;
  }

  // User is authenticated and is admin, render the protected content
  return <>{children}</>;
}

export default ProtectedAdminRoute;
