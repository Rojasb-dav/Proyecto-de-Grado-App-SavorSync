import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { showMessage } from 'react-native-flash-message';

// API Configuration
const API_URL = 'http://192.168.2.6:5000/api';

interface User {
  id: string;
  email: string;
  username: string;
  fullName: string;
  phone?: string;
  avatarUrl?: string;
  isActive: boolean;
  emailVerified: boolean;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
}

interface RegisterData {
  email: string;
  username: string;
  password: string;
  fullName: string;
  phone?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check authentication status on app start
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    console.log('🔍 Checking auth status...');
    try {
      const storedToken = await AsyncStorage.getItem('auth_token');
      const storedUser = await AsyncStorage.getItem('auth_user');
      console.log('📦 Stored token exists:', !!storedToken);
      console.log('📦 Stored user exists:', !!storedUser);

      if (storedToken && storedUser) {
        console.log('✅ Token found, verifying with backend...');
        // Verify token is still valid with timeout
        const response = await axios.get(`${API_URL}/auth/me`, {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
          timeout: 5000, // 5 seconds timeout
        });

        if (response.data.user) {
          setUser(response.data.user);
          setToken(storedToken);
        } else {
          // Token invalid, clear storage
          await AsyncStorage.multiRemove(['auth_token', 'auth_user']);
        }
      }
    } catch (error) {
      console.error('❌ Auth status check failed:', error);
      // Clear storage on error
      try {
        await AsyncStorage.multiRemove(['auth_token', 'auth_user']);
        console.log('🗑️ Cleared auth storage due to error');
      } catch (storageError) {
        console.error('Failed to clear storage:', storageError);
      }
    } finally {
      // Always set loading to false
      console.log('✅ Auth check complete, setting isLoading to false');
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password,
        platform: 'mobile',
        deviceInfo: {
          platform: 'mobile',
          timestamp: new Date().toISOString(),
        },
      });

      const { user: userData, token: userToken } = response.data;

      // Store in AsyncStorage
      await AsyncStorage.setItem('auth_token', userToken);
      await AsyncStorage.setItem('auth_user', JSON.stringify(userData));

      setUser(userData);
      setToken(userToken);

      showMessage({
        message: '¡Bienvenido!',
        description: `Has iniciado sesión como ${userData.fullName}`,
        type: 'success',
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Error al iniciar sesión';
      showMessage({
        message: 'Error de inicio de sesión',
        description: errorMessage,
        type: 'danger',
      });
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterData) => {
    try {
      setIsLoading(true);
      
      const response = await axios.post(`${API_URL}/auth/register`, userData);

      const { user: newUser, token: userToken } = response.data;

      // Store in AsyncStorage
      await AsyncStorage.setItem('auth_token', userToken);
      await AsyncStorage.setItem('auth_user', JSON.stringify(newUser));

      setUser(newUser);
      setToken(userToken);

      showMessage({
        message: '¡Registro exitoso!',
        description: `Bienvenido a SavorSync, ${newUser.fullName}`,
        type: 'success',
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Error al registrarse';
      showMessage({
        message: 'Error de registro',
        description: errorMessage,
        type: 'danger',
      });
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      if (token) {
        await axios.post(`${API_URL}/auth/logout`, {}, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }
    } catch (error) {
      console.error('Logout API call failed:', error);
    } finally {
      // Clear local storage regardless of API call success
      await AsyncStorage.multiRemove(['auth_token', 'auth_user']);
      setUser(null);
      setToken(null);

      showMessage({
        message: 'Sesión cerrada',
        description: 'Has cerrado sesión exitosamente',
        type: 'info',
      });
    }
  };

  const refreshToken = async () => {
    try {
      if (!token) return;

      const response = await axios.post(`${API_URL}/auth/refresh`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const { token: newToken } = response.data;
      await AsyncStorage.setItem('auth_token', newToken);
      setToken(newToken);
    } catch (error) {
      console.error('Token refresh failed:', error);
      // If refresh fails, logout user
      await logout();
    }
  };

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    isAuthenticated: !!user && !!token,
    login,
    register,
    logout,
    refreshToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Axios interceptor for adding auth token
export const setupAxiosInterceptors = (token: string | null) => {
  axios.interceptors.request.use(
    (config) => {
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  axios.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (error.response?.status === 401) {
        // Token expired, try to refresh
        const authContext = useContext(AuthContext);
        if (authContext) {
          try {
            await authContext.refreshToken();
            // Retry the original request with new token
            const originalRequest = error.config;
            originalRequest.headers.Authorization = `Bearer ${authContext.token}`;
            return axios(originalRequest);
          } catch (refreshError) {
            // Refresh failed, logout user
            await authContext.logout();
          }
        }
      }
      return Promise.reject(error);
    }
  );
};
