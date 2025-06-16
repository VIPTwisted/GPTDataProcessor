
import React from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const BrandProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const { brandId } = useParams();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Authenticating...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Admins can access all brands, users can only access their assigned brand
  const hasAccess = user.role === 'admin' || user.brandId === brandId;
  
  if (!hasAccess) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-6xl mb-4">🚫</div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Access Denied
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            You don't have permission to access this brand.
          </p>
          <Navigate to={user.brandId ? `/${user.brandId}` : '/'} replace />
        </div>
      </div>
    );
  }

  return children;
};

export default BrandProtectedRoute;
