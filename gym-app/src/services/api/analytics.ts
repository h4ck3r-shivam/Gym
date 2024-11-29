import axios from 'axios';
import { API_URL } from './config';
import { ApiResponse } from '../../types';

interface AnalyticsData {
  totalBookings: number;
  totalRevenue: number;
  totalUsers: number;
  bookingsByDay: { date: string; count: number }[];
  revenueByDay: { date: string; amount: number }[];
  popularSlots: { slotId: string; name: string; bookings: number }[];
}

interface GymAnalytics extends AnalyticsData {
  averageRating: number;
  totalReviews: number;
  membershipStats: {
    active: number;
    expired: number;
    total: number;
  };
}

interface OwnerAnalytics extends AnalyticsData {
  totalGyms: number;
  gymPerformance: {
    gymId: string;
    name: string;
    bookings: number;
    revenue: number;
    rating: number;
  }[];
}

export const analyticsAPI = {
  async getGymAnalytics(gymId: string, startDate?: string, endDate?: string): Promise<ApiResponse<GymAnalytics>> {
    try {
      const params = { startDate, endDate };
      const response = await axios.get(`${API_URL}/analytics/gym/${gymId}`, { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async getOwnerAnalytics(startDate?: string, endDate?: string): Promise<ApiResponse<OwnerAnalytics>> {
    try {
      const params = { startDate, endDate };
      const response = await axios.get(`${API_URL}/analytics/owner`, { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async getAdminAnalytics(startDate?: string, endDate?: string): Promise<ApiResponse<AnalyticsData>> {
    try {
      const params = { startDate, endDate };
      const response = await axios.get(`${API_URL}/analytics/admin`, { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};
