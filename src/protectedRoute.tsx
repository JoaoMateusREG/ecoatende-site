import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './authContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const location = useLocation();
  const { isAuthenticated, loading, checkAuthStatus } = useAuth();
  const [hasChecked, setHasChecked] = useState(false);

  useEffect(() => {
    const verifyAuth = async () => {
      // Se já está autenticado, não precisa verificar
      if (isAuthenticated) {
        setHasChecked(true);
        return;
      }
      
      // Só verificar se ainda não foi verificado e não está carregando
      if (!hasChecked && !loading) {
        try {
          await checkAuthStatus();
        } catch (error) {
          console.error('Erro ao verificar autenticação:', error);
        } finally {
          setHasChecked(true);
        }
      }
    };

    verifyAuth();
  }, [hasChecked, loading, checkAuthStatus, isAuthenticated]);

  // Mostrar loading enquanto verifica autenticação
  if (loading || (!hasChecked && !isAuthenticated)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redireciona para login se não estiver autenticado, preservando a URL de destino
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;