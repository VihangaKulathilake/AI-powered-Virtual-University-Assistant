import React, { createContext, useState, useEffect, useContext, type ReactNode } from 'react';
import api from '../services/api';

interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true); // True while restoring session from storage

  // Restore session from localStorage on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('auth_token');
    const savedUser = localStorage.getItem('auth_user');
    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
      }
    }
    setIsLoading(false);
  }, []);

  /**
   * Authenticate user and store token
   */
  const login = async (email: string, password: string): Promise<void> => {
    const response = await api.post<{ success: boolean; data: { token: string; user: AuthUser } }>(
      '/auth/login',
      { email, password }
    );
    const { token: newToken, user: newUser } = response.data.data;

    // Persist to localStorage
    localStorage.setItem('auth_token', newToken);
    localStorage.setItem('auth_user', JSON.stringify(newUser));

    setToken(newToken);
    setUser(newUser);
  };

  /**
   * Register a new account. Does NOT auto-login — returns without setting state.
   */
  const register = async (name: string, email: string, password: string): Promise<void> => {
    await api.post('/auth/register', { name, email, password });
    // Account created — caller should redirect user to /login
  };

  /**
   * Log out the current user and clear all auth state
   */
  const logout = (): void => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Hook to consume AuthContext
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside <AuthProvider>');
  }
  return context;
};
