'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { validateCredentials, setAuthSession, checkAuthSession, logout as authLogout } from './auth-service';

interface AuthContextType {
  isAuthenticated: boolean;
  loading: boolean;
  signIn: (id: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 컴포넌트 마운트 시 세션 확인
    const hasValidSession = checkAuthSession();
    setIsAuthenticated(hasValidSession);
    setLoading(false);
  }, []);

  const signIn = async (id: string, password: string) => {
    setLoading(true);
    
    try {
      const result = await validateCredentials(id, password);
      
      if (result.success) {
        setAuthSession(true);
        setIsAuthenticated(true);
      }
      
      setLoading(false);
      return result;
    } catch {
      setLoading(false);
      return { 
        success: false, 
        error: '로그인 중 오류가 발생했습니다' 
      };
    }
  };

  const logout = () => {
    authLogout();
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, loading, signIn, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};