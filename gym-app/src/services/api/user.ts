import axios from 'axios';
import { ApiResponse, User, UpdateProfileData, Partial } from '../../types';
import { API_URL } from './config';

const userAPI = {
  getProfile: async (): Promise<ApiResponse<User>> => {
    const response = await axios.get(`${API_URL}/users/profile`);
    return response.data;
  },

  updateProfile: async (data: UpdateProfileData): Promise<ApiResponse<User>> => {
    const response = await axios.put(`${API_URL}/users/profile`, data);
    return response.data;
  },

  getAllUsers: async (query?: { role?: string; search?: string }): Promise<ApiResponse<User[]>> => {
    const response = await axios.get(`${API_URL}/users`, { params: query });
    return response.data;
  },

  getUser: async (userId: string): Promise<ApiResponse<User>> => {
    const response = await axios.get(`${API_URL}/users/${userId}`);
    return response.data;
  },

  updateUser: async (userId: string, data: Partial<User>): Promise<ApiResponse<User>> => {
    const response = await axios.put(`${API_URL}/users/${userId}`, data);
    return response.data;
  },

  deleteUser: async (userId: string): Promise<ApiResponse<void>> => {
    const response = await axios.delete(`${API_URL}/users/${userId}`);
    return response.data;
  },
};

export default userAPI;
