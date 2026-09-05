import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
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

const getStoredUser = (): IUser | null => {
  try {
    const savedUser =
      localStorage.getItem('memora_user') ||
      localStorage.getItem('user');

    return savedUser ? JSON.parse(savedUser) : null;
  } catch {
    return null;
  }
};

const getStoredToken = (): string | null => {
  return (
    localStorage.getItem('memora_token') ||
    localStorage.getItem('token') ||
    null
  );
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<IUser | null>(getStoredUser);

  const [token, setToken] = useState<string | null>(getStoredToken);

  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchMe = async () => {
      const savedToken = getStoredToken();

      if (!savedToken) {
        setIsLoading(false);
        return;
      }

      setToken(savedToken);

      try {
        const res = await api.get('/auth/me');

        if (res.data?.success && res.data?.user) {
          const freshUser = res.data.user;

          setUser(freshUser);

          localStorage.setItem(
            'memora_user',
            JSON.stringify(freshUser)
          );

          localStorage.setItem(
            'user',
            JSON.stringify(freshUser)
          );
        }

        // Do not clear local session for non-401 responses.
      } catch (error: any) {
        if (error?.response?.status === 401) {
          localStorage.removeItem('memora_token');
          localStorage.removeItem('token');
          localStorage.removeItem('memora_user');
          localStorage.removeItem('user');

          setToken(null);
          setUser(null);
        }

        // 404 / 500 / network error:
        // preserve the existing local session.
      } finally {
        setIsLoading(false);
      }
    };

    fetchMe();
  }, []);

  const login = async (email: string, password: string) => {
    const res = await api.post('/auth/login', {
      email,
      password,
    });

    if (res.data?.success && res.data?.token) {
      const newToken = res.data.token;
      const newUser = res.data.user;

      localStorage.setItem('memora_token', newToken);
      localStorage.setItem('token', newToken);

      if (newUser) {
        localStorage.setItem(
          'memora_user',
          JSON.stringify(newUser)
        );

        localStorage.setItem(
          'user',
          JSON.stringify(newUser)
        );
      }

      setToken(newToken);
      setUser(newUser);
    }
  };

  const register = async (data: any) => {
    const res = await api.post('/auth/register', data);

    if (res.data?.success && res.data?.token) {
      const newToken = res.data.token;
      const newUser = res.data.user;

      localStorage.setItem('memora_token', newToken);
      localStorage.setItem('token', newToken);

      if (newUser) {
        localStorage.setItem(
          'memora_user',
          JSON.stringify(newUser)
        );

        localStorage.setItem(
          'user',
          JSON.stringify(newUser)
        );
      }

      setToken(newToken);
      setUser(newUser);
    }
  };

  const googleLogin = async (data: any) => {
    const res = await api.post('/auth/google', data);

    if (res.data?.success && res.data?.token) {
      const newToken = res.data.token;
      const newUser = res.data.user;

      localStorage.setItem('memora_token', newToken);
      localStorage.setItem('token', newToken);

      if (newUser) {
        localStorage.setItem(
          'memora_user',
          JSON.stringify(newUser)
        );

        localStorage.setItem(
          'user',
          JSON.stringify(newUser)
        );
      }

      setToken(newToken);
      setUser(newUser);
    }
  };

  const logout = () => {
    localStorage.removeItem('memora_token');
    localStorage.removeItem('token');
    localStorage.removeItem('memora_user');
    localStorage.removeItem('user');

    setToken(null);
    setUser(null);
  };

  const updateProfile = async (data: any) => {
    const res = await api.put('/auth/profile', data);

    if (res.data?.success) {
      const updatedUser = res.data.user;

      setUser(updatedUser);

      localStorage.setItem(
        'memora_user',
        JSON.stringify(updatedUser)
      );

      localStorage.setItem(
        'user',
        JSON.stringify(updatedUser)
      );
    }
  };

  const demoLogin = async (
    role: 'customer' | 'shop_owner' | 'admin'
  ) => {
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
        isAuthenticated: !!user && !!token,
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
