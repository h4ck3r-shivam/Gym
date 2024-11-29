import axios from 'axios';
import { ApiResponse, Notification, NotificationSettings } from '../../types';
import { API_URL } from './config';

const notificationAPI = {
  getNotifications: async (): Promise<ApiResponse<Notification[]>> => {
    const response = await axios.get(`${API_URL}/notifications`);
    return response.data;
  },

  getUnreadCount: async (): Promise<ApiResponse<{ count: number }>> => {
    const response = await axios.get(`${API_URL}/notifications/unread/count`);
    return response.data;
  },

  markAsRead: async (notificationId: string): Promise<ApiResponse<Notification>> => {
    const response = await axios.put(`${API_URL}/notifications/${notificationId}/read`);
    return response.data;
  },

  markAllAsRead: async (): Promise<ApiResponse<{ message: string }>> => {
    const response = await axios.put(`${API_URL}/notifications/read-all`);
    return response.data;
  },

  deleteNotification: async (notificationId: string): Promise<ApiResponse<{ message: string }>> => {
    const response = await axios.delete(`${API_URL}/notifications/${notificationId}`);
    return response.data;
  },

  getSettings: async (): Promise<ApiResponse<NotificationSettings>> => {
    const response = await axios.get(`${API_URL}/notifications/settings`);
    return response.data;
  },

  updateSettings: async (settings: Partial<NotificationSettings>): Promise<ApiResponse<NotificationSettings>> => {
    const response = await axios.put(`${API_URL}/notifications/settings`, settings);
    return response.data;
  }
};

export { notificationAPI };
