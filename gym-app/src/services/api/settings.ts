import axios from 'axios';
import { API_URL } from './config';
import { NotificationSettings, PrivacySettings, ApiResponse } from '../../types';

export const settingsAPI = {
  async getNotificationSettings(): Promise<ApiResponse<NotificationSettings>> {
    try {
      const response = await axios.get(`${API_URL}/settings/notifications`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async updateNotificationSettings(settings: Partial<NotificationSettings>): Promise<ApiResponse<NotificationSettings>> {
    try {
      const response = await axios.put(`${API_URL}/settings/notifications`, settings);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async getPrivacySettings(): Promise<ApiResponse<PrivacySettings>> {
    try {
      const response = await axios.get(`${API_URL}/settings/privacy`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async updatePrivacySettings(settings: Partial<PrivacySettings>): Promise<ApiResponse<PrivacySettings>> {
    try {
      const response = await axios.put(`${API_URL}/settings/privacy`, settings);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async getTheme(): Promise<ApiResponse<{ theme: 'light' | 'dark' }>> {
    try {
      const response = await axios.get(`${API_URL}/settings/theme`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async updateTheme(theme: 'light' | 'dark'): Promise<ApiResponse<{ theme: 'light' | 'dark' }>> {
    try {
      const response = await axios.put(`${API_URL}/settings/theme`, { theme });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};
