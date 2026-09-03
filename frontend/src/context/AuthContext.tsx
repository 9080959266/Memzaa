import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '../api/client';
import { IUser } from '../types';

interface AuthContextType {
  user: IUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  googleLogin: (data: any) => Promise<void>;
  logout: () => void;
  updateProfile: (data: any) => Promise<void>;
  demoLogin: (role: 'customer' | 'shop_owner' | 'admin') => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('memora_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Fetch current user details on mount
  useEffect(() => {
    const fetchMe = async () => {
      if (!token) {
        setIsLoading(false);
        return;
      }
      try {
        const res = await api.get('/auth/me');
        if (res.data.success) {
          setUser(res.data.user);
        } else {
          logout();
        }
      } catch {
        logout();
      } finally {
        setIsLoading(false);
      }
    };

    fetchMe();
  }, [token]);

  const login = async (email: string, password: string) => {
    const res = await api.post('/auth/login', { email, password });
    if (res.data.success) {
      localStorage.setItem('memora_token', res.data.token);
      setToken(res.data.token);
      setUser(res.data.user);
    }
  };

  const register = async (data: any) => {
    const res = await api.post('/auth/register', data);
    if (res.data.success) {
      localStorage.setItem('memora_token', res.data.token);
      setToken(res.data.token);
      setUser(res.data.user);
    }
  };

  const googleLogin = async (data: any) => {
    const res = await api.post('/auth/google', data);
    if (res.data.success) {
      localStorage.setItem('memora_token', res.data.token);
      setToken(res.data.token);
      setUser(res.data.user);
    }
  };

  const logout = () => {
    localStorage.removeItem('memora_token');
    setToken(null);
    setUser(null);
  };

  const updateProfile = async (data: any) => {
    const res = await api.put('/auth/profile', data);
    if (res.data.success) {
      setUser(res.data.user);
    }
  };

  const demoLogin = async (role: 'customer' | 'shop_owner' | 'admin') => {
    let email = 'customer@memora.com';
    let password = 'Customer@123';

    if (role === 'shop_owner') {
      email = 'owner@memora.com';
      password = 'Owner@123';
    } else if (role === 'admin') {
      email = 'admin@memora.com';
      password = 'Admin@123';
    }

    await login(email, password);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        googleLogin,
        logout,
        updateProfile,
        demoLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
