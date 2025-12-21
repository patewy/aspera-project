// src/hooks/useAuth.ts
import { useState, useEffect, useCallback } from 'react';

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('user');
    
    console.log('🔍 useAuth: токен при загрузке:', token);
    console.log('🔍 useAuth: isAuthenticated будет:', !!token);
    
    setIsAuthenticated(!!token);
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch {
        setUser(null);
      }
    }
    setIsLoading(false);
  }, []);

  // 🔧 Убедитесь что login принимает токен
  const login = useCallback((token: string) => {
    console.log('🔍 useAuth.login вызван с токеном:', token ? 'Да' : 'Нет');
    
    if (token) {
      localStorage.setItem('authToken', token);
      setIsAuthenticated(true);
      console.log('✅ useAuth: isAuthenticated установлен в true');
    } else {
      console.error('❌ useAuth: передан пустой токен');
    }
  }, []);

  const logout = useCallback(() => {
    console.log('🔍 useAuth.logout вызван');
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
  }, []);

  return { 
    isAuthenticated, 
    isLoading,
    user,
    login, 
    logout 
  };
}