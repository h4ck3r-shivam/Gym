import axios from 'axios';
import { ApiResponse, Gym } from '../../types';
import { API_URL } from './config';

const gymAPI = {
  getAllGyms: async (query?: { search?: string; city?: string }): Promise<ApiResponse<Gym[]>> => {
    const response = await axios.get(`${API_URL}/gyms`, { params: query });
    return response.data;
  },

  getGymById: async (gymId: string): Promise<ApiResponse<Gym>> => {
    const response = await axios.get(`${API_URL}/gyms/${gymId}`);
    return response.data;
  },

  getOwnerGyms: async (): Promise<ApiResponse<Gym[]>> => {
    const response = await axios.get(`${API_URL}/gyms/owner`);
    return response.data;
  },

  createGym: async (data: FormData): Promise<ApiResponse<Gym>> => {
    const response = await axios.post(`${API_URL}/gyms`, data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  updateGym: async (gymId: string, data: FormData): Promise<ApiResponse<Gym>> => {
    const response = await axios.put(`${API_URL}/gyms/${gymId}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  deleteGym: async (gymId: string): Promise<ApiResponse<{ message: string }>> => {
    const response = await axios.delete(`${API_URL}/gyms/${gymId}`);
    return response.data;
  },

  uploadGymImages: async (gymId: string, images: FormData): Promise<ApiResponse<Gym>> => {
    const response = await axios.post(`${API_URL}/gyms/${gymId}/images`, images, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  deleteGymImage: async (gymId: string, imageUrl: string): Promise<ApiResponse<Gym>> => {
    const response = await axios.delete(`${API_URL}/gyms/${gymId}/images`, {
      data: { imageUrl }
    });
    return response.data;
  },

  searchGyms: async (query: string): Promise<ApiResponse<Gym[]>> => {
    const response = await axios.get(`${API_URL}/gyms/search`, {
      params: { query }
    });
    return response.data;
  }
};

export { gymAPI };
