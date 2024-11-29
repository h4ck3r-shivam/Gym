import axios from 'axios';
import { API_URL } from './config';
import { LoginCredentials, RegisterData, User, ApiResponse } from '../../types';

export const authAPI = {
  async login(credentials: LoginCredentials): Promise<ApiResponse<{ user: User; token: string }>> {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, credentials);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async register(data: RegisterData): Promise<ApiResponse<{ user: User; token: string }>> {
    try {
      const response = await axios.post(`${API_URL}/auth/register`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async verifyToken(): Promise<ApiResponse<{ user: User }>> {
    try {
      const response = await axios.get(`${API_URL}/auth/verify`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async logout(): Promise<ApiResponse<null>> {
    try {
      const response = await axios.post(`${API_URL}/auth/logout`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async forgotPassword(email: string): Promise<ApiResponse<{ message: string }>> {
    try {
      const response = await axios.post(`${API_URL}/auth/forgot-password`, { email });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async resetPassword(token: string, password: string): Promise<ApiResponse<{ message: string }>> {
    try {
      const response = await axios.post(`${API_URL}/auth/reset-password`, { token, password });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async changePassword(data: { currentPassword: string; newPassword: string }): Promise<ApiResponse<void>> {
    try {
      const response = await axios.post(`${API_URL}/auth/change-password`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
