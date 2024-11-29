import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, LoginCredentials, RegisterData, UpdateProfileData, AuthContextType } from '../types';
import { authAPI } from '../services/api';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      setLoading(true);
      verifyToken();
    }
  }, []);

  const verifyToken = async () => {
    try {
      const response = await authAPI.verifyToken();
      setCurrentUser(response.data.user);
      setToken(response.data.token);
    } catch (err) {
      localStorage.removeItem('token');
      setCurrentUser(null);
      setToken(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials: LoginCredentials) => {
    setLoading(true);
    try {
      setError(null);
      const response = await authAPI.login(credentials);
      localStorage.setItem('token', response.data.token);
      setCurrentUser(response.data.user);
      setToken(response.data.token);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to login');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: RegisterData) => {
    setLoading(true);
    try {
      setError(null);
      const response = await authAPI.register(data);
      localStorage.setItem('token', response.data.token);
      setCurrentUser(response.data.user);
      setToken(response.data.token);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to register');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      setError(null);
      await authAPI.logout();
      localStorage.removeItem('token');
      setCurrentUser(null);
      setToken(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to logout');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (data: UpdateProfileData) => {
    setLoading(true);
    try {
      setError(null);
      const response = await authAPI.updateProfile(data);
      setCurrentUser(response.data.user);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update profile');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string) => {
    setLoading(true);
    try {
      setError(null);
      await authAPI.changePassword({ currentPassword, newPassword });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to change password');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError(null);

  const value: AuthContextType = {
    currentUser,
    token,
    loading,
    error,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    verifyToken,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
