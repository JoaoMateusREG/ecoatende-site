import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './authContext';

interface PublicRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ children, redirectTo = '/dashboard' }) => {
  const { isAuthenticated, loading, checkAuthStatus } = useAuth();
  const [hasChecked, setHasChecked] = useState(false);

  useEffect(() => {
    const verifyAuth = async () => {
      if (isAuthenticated) {
        setHasChecked(true);
        return;
      }
      
      if (!hasChecked && !loading) {
        try {
          await checkAuthStatus();
        } catch (error) {
          console.debug('Usuário não autenticado');
        } finally {
          setHasChecked(true);
        }
      }
    };

    verifyAuth();
  }, [hasChecked, loading, checkAuthStatus, isAuthenticated]);

  if (loading || !hasChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
};

export default PublicRoute;