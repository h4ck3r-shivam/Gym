import axios from 'axios';
import { ApiResponse, User, UpdateProfileData } from '../../types';
import { getConfig } from './config';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const userAPI = {
  getProfile: async (): Promise<ApiResponse<User>> => {
    const response = await axios.get(`${BASE_URL}/users/profile`, getConfig());
    return response.data;
  },

  updateProfile: async (data: UpdateProfileData): Promise<ApiResponse<User>> => {
    const response = await axios.put(`${BASE_URL}/users/profile`, data, getConfig());
    return response.data;
  },

  getUsers: async (): Promise<ApiResponse<User[]>> => {
    const response = await axios.get(`${BASE_URL}/users`, getConfig());
    return response.data;
  },

  getUser: async (id: string): Promise<ApiResponse<User>> => {
    const response = await axios.get(`${BASE_URL}/users/${id}`, getConfig());
    return response.data;
  },

  updateUser: async (id: string, data: Partial<User>): Promise<ApiResponse<User>> => {
    const response = await axios.put(`${BASE_URL}/users/${id}`, data, getConfig());
    return response.data;
  },

  deleteUser: async (id: string): Promise<ApiResponse<void>> => {
    const response = await axios.delete(`${BASE_URL}/users/${id}`, getConfig());
    return response.data;
  },
};
