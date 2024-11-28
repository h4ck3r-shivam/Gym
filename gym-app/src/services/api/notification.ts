import axios from 'axios';
import { ApiResponse, Notification } from '../../types';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const notificationAPI = {
  getNotifications: async (): Promise<ApiResponse<Notification[]>> => {
    const response = await axios.get(`${BASE_URL}/notifications`);
    return response.data;
  },

  markAsRead: async (id: string): Promise<ApiResponse<Notification>> => {
    const response = await axios.put(`${BASE_URL}/notifications/${id}/read`);
    return response.data;
  },

  deleteNotification: async (id: string): Promise<ApiResponse<void>> => {
    const response = await axios.delete(`${BASE_URL}/notifications/${id}`);
    return response.data;
  },
};
