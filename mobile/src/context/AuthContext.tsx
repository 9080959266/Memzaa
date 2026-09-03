import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../api/client';
import { IUser, UserRole } from '../types';

interface AuthContextType {
  user: IUser | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  demoLogin: (role: UserRole) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<IUser>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadStoredAuth = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('@memora_token');
        const storedUser = await AsyncStorage.getItem('@memora_user');

        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        } else {
          // Default to demo customer for zero-friction exploration
          await demoLogin('customer');
        }
      } catch (err) {
        console.error('Error loading stored auth', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadStoredAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.data.success) {
        const { token: receivedToken, user: receivedUser } = res.data;
        setToken(receivedToken);
        setUser(receivedUser);
        await AsyncStorage.setItem('@memora_token', receivedToken);
        await AsyncStorage.setItem('@memora_user', JSON.stringify(receivedUser));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const demoLogin = async (role: UserRole) => {
    setIsLoading(true);
    try {
      const res = await api.post('/auth/demo-login', { role });
      if (res.data.success) {
        const { token: receivedToken, user: receivedUser } = res.data;
        setToken(receivedToken);
        setUser(receivedUser);
        await AsyncStorage.setItem('@memora_token', receivedToken);
        await AsyncStorage.setItem('@memora_user', JSON.stringify(receivedUser));
      }
    } catch (err) {
      console.warn('Backend unavailable, using simulated local user for', role);
      const mockUser: IUser = {
        _id: `mock_${role}_id`,
        name: role === 'customer' ? 'Priya Ramanathan' : role === 'shop_owner' ? 'Aarav Sharma' : 'MEMORA Super Admin',
        email: `${role}@memora.com`,
        role,
        phone: '+91 98401 23456',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      };
      setUser(mockUser);
      setToken(`mock_jwt_${role}`);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: any) => {
    setIsLoading(true);
    try {
      const res = await api.post('/auth/register', data);
      if (res.data.success) {
        const { token: receivedToken, user: receivedUser } = res.data;
        setToken(receivedToken);
        setUser(receivedUser);
        await AsyncStorage.setItem('@memora_token', receivedToken);
        await AsyncStorage.setItem('@memora_user', JSON.stringify(receivedUser));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setUser(null);
    setToken(null);
    await AsyncStorage.removeItem('@memora_token');
    await AsyncStorage.removeItem('@memora_user');
  };

  const updateProfile = async (data: Partial<IUser>) => {
    const res = await api.put('/auth/profile', data);
    if (res.data.success) {
      setUser(res.data.user);
      await AsyncStorage.setItem('@memora_user', JSON.stringify(res.data.user));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        demoLogin,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
