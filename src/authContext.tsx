import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import type { ReactNode } from 'react';
import axios from './axiosConfig';

interface User {
  cpf: string;
  name: string;
  organizationCnpj: string;
  isActive: boolean;
  role: string;
  picture?: string;
  services: Array<{
    id: number;
    name: string;
    prefix: string;
  }>;
  organization?: {
    cnpj: string;
    name: string;
    email: string;
    customerId?: string;
  };
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (cpf: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUserData: () => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  checkAuthStatus: () => Promise<boolean>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [, setIsInitialized] = useState(false);

  // Função para verificar autenticação quando necessário
  const checkAuthStatus = useCallback(async () => {
    if (loading) return false; // Evitar verificações simultâneas
    
    try {
      setLoading(true);
      const authResponse = await axios.get('/auth/me');
      const userData = authResponse.data as User;
      setUser(userData);
      setIsInitialized(true);
      return true;
    } catch (error) {
      setUser(null);
      setIsInitialized(true);
      return false;
    } finally {
      setLoading(false);
    }
  }, [loading]);



  const login = useCallback(async (cpf: string, password: string) => {
    try {
      // Fazer login - o backend criará a sessão e enviará o cookie sessionId
      const response = await axios.post('/auth/login', {
        cpf: cpf.replace(/\D/g, ''),
        password,
      });

      // O backend retorna os dados do usuário diretamente
      const responseData = response.data;
      
      // Verificar se os dados estão aninhados em um objeto 'user'
      const finalUserData = (responseData as any).user || responseData as User;
      

      
      setUser(finalUserData);
      setIsInitialized(true);
      
      // Buscar dados completos do usuário incluindo role
      try {
        const authResponse = await axios.get('/auth/me');
        const completeUserData = authResponse.data as User;
        setUser(completeUserData);
      } catch (error) {
        // Se falhar, manter os dados do login
        console.warn('Falha ao buscar dados completos do usuário:', error);
      }
    } catch (error) {
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      // Chamar endpoint de logout para invalidar a sessão
      await axios.post('/auth/logout');
    } catch (error) {
      // Ignorar erro, continuar com logout local
    } finally {
      // Sempre limpar o estado local, mesmo se a requisição falhar
      setUser(null);
      setLoading(false);
      // Não resetar isInitialized para evitar problemas de renderização
    }
  }, []);

  const refreshUserData = useCallback(async () => {
    // Só atualizar se já tiver um usuário e não estiver carregando
    if (user && !loading) {
      try {
        const response = await axios.get('/auth/me');
        const userData = response.data as User;
        setUser(userData);
      } catch (error) {
        // Se falhar, não limpar o usuário imediatamente
        // Deixar o interceptor do axios lidar com 401
        console.warn('Falha ao atualizar dados do usuário:', error);
      }
    }
  }, [user, loading]);

  const changePassword = useCallback(async (currentPassword: string, newPassword: string) => {
    try {
      await axios.put('/auth/change-password', {
        currentPassword,
        newPassword,
      });
    } catch (error) {
      throw error;
    }
  }, []);

  const isAuthenticated = useMemo(() => !!user, [user]);

  const value: AuthContextType = useMemo(() => ({
    user,
    loading,
    login,
    logout,
    refreshUserData,
    changePassword,
    checkAuthStatus,
    isAuthenticated,
  }), [user, loading, login, logout, refreshUserData, changePassword, checkAuthStatus, isAuthenticated]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
