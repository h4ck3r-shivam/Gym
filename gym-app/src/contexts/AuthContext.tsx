import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { User, RegisterData as RegisterDataType } from '../types';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterDataType) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: UpdateProfileData) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  clearError: () => void;
}

interface UpdateProfileData {
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  profilePicture?: File;
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  loading: true,
  error: null,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  updateProfile: async () => {},
  changePassword: async () => {},
  clearError: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const { data } = await authAPI.getCurrentUser();
        setCurrentUser(data.data.user);
      }
    } catch (error) {
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { data } = await authAPI.login({ email, password });
      localStorage.setItem('token', data.data.token);
      setCurrentUser(data.data.user);
      navigate('/');
    } catch (error: any) {
      setError(error.response?.data?.message || 'Login failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: RegisterDataType) => {
    try {
      setLoading(true);
      const { data } = await authAPI.register(userData);
      localStorage.setItem('token', data.data.token);
      setCurrentUser(data.data.user);
      navigate('/');
    } catch (error: any) {
      setError(error.response?.data?.message || 'Registration failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      localStorage.removeItem('token');
      setCurrentUser(null);
      navigate('/login');
    } catch (error: any) {
      setError(error.message || 'Logout failed');
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (data: UpdateProfileData) => {
    try {
      setError(null);
      const formData = new FormData();
      
      if (data.firstName) formData.append('firstName', data.firstName);
      if (data.lastName) formData.append('lastName', data.lastName);
      if (data.email) formData.append('email', data.email);
      if (data.phoneNumber) formData.append('phoneNumber', data.phoneNumber);
      if (data.profilePicture) formData.append('profilePicture', data.profilePicture);

      const response = await authAPI.updateProfile(data);
      setCurrentUser(response.data.data.user);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Profile update failed');
      throw error;
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string) => {
    try {
      setError(null);
      setLoading(true);
      await authAPI.changePassword({ currentPassword, newPassword });
    } catch (error: any) {
      setError(error.response?.data?.message || 'Password change failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError(null);

  const value = {
    currentUser,
    loading,
    error,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
