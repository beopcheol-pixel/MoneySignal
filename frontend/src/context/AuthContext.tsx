import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { auth as authApi, setToken, clearToken, loadToken } from '../services/api';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: { name?: string; isSubscribed?: boolean } | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<{ name?: string; isSubscribed?: boolean } | null>(null);

  useEffect(() => {
    loadToken().then((token) => {
      if (token) setIsAuthenticated(true);
      setIsLoading(false);
    });
  }, []);

  const login = async (email: string, password: string) => {
    const result = await authApi.login(email, password);
    await setToken(result.token);
    setUser({ name: result.name, isSubscribed: result.isSubscribed });
    setIsAuthenticated(true);
  };

  const register = async (email: string, password: string, name?: string) => {
    const result = await authApi.register(email, password, name);
    await setToken(result.token);
    setIsAuthenticated(true);
  };

  const logout = () => {
    clearToken();
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
