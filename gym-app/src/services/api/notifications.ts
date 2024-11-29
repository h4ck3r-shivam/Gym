import axios from 'axios';
import { API_URL } from './config';
import { Notification, ApiResponse } from '../../types';

export const notificationAPI = {
  async getNotifications(): Promise<ApiResponse<Notification[]>> {
    try {
      const response = await axios.get(`${API_URL}/notifications`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async markAsRead(notificationId: string): Promise<ApiResponse<Notification>> {
    try {
      const response = await axios.put(`${API_URL}/notifications/${notificationId}/read`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async markAllAsRead(): Promise<ApiResponse<{ count: number }>> {
    try {
      const response = await axios.put(`${API_URL}/notifications/read-all`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async deleteNotification(notificationId: string): Promise<ApiResponse<{ message: string }>> {
    try {
      const response = await axios.delete(`${API_URL}/notifications/${notificationId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async getUnreadCount(): Promise<ApiResponse<{ count: number }>> {
    try {
      const response = await axios.get(`${API_URL}/notifications/unread-count`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};
