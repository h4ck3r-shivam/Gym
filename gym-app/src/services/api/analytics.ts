import axios from 'axios';
import { ApiResponse } from '../../types';
import { getConfig } from './config';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export interface AnalyticsData {
  revenue: {
    total: number;
    monthly: { month: string; amount: number }[];
  };
  bookings: {
    total: number;
    monthly: { month: string; count: number }[];
  };
  users: {
    total: number;
    active: number;
    new: { month: string; count: number }[];
  };
  classes: {
    total: number;
    popular: { name: string; bookings: number }[];
  };
}

export const analyticsAPI = {
  getAnalytics: async (): Promise<ApiResponse<AnalyticsData>> => {
    const response = await axios.get(`${BASE_URL}/analytics`, getConfig());
    return response.data;
  },

  getRevenueStats: async (period: string): Promise<ApiResponse<AnalyticsData['revenue']>> => {
    const response = await axios.get(`${BASE_URL}/analytics/revenue?period=${period}`, getConfig());
    return response.data;
  },

  getBookingStats: async (period: string): Promise<ApiResponse<AnalyticsData['bookings']>> => {
    const response = await axios.get(`${BASE_URL}/analytics/bookings?period=${period}`, getConfig());
    return response.data;
  },

  getUserStats: async (period: string): Promise<ApiResponse<AnalyticsData['users']>> => {
    const response = await axios.get(`${BASE_URL}/analytics/users?period=${period}`, getConfig());
    return response.data;
  },

  getClassStats: async (period: string): Promise<ApiResponse<AnalyticsData['classes']>> => {
    const response = await axios.get(`${BASE_URL}/analytics/classes?period=${period}`, getConfig());
    return response.data;
  },
};
