import axios from 'axios';
import { API_URL } from './config';
import { Review, ApiResponse } from '../../types';

export const reviewAPI = {
  async getGymReviews(gymId: string): Promise<ApiResponse<Review[]>> {
    try {
      const response = await axios.get(`${API_URL}/gyms/${gymId}/reviews`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async createReview(gymId: string, review: { rating: number; comment: string }): Promise<ApiResponse<Review>> {
    try {
      const response = await axios.post(`${API_URL}/gyms/${gymId}/reviews`, review);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async updateReview(gymId: string, reviewId: string, review: { rating?: number; comment?: string }): Promise<ApiResponse<Review>> {
    try {
      const response = await axios.put(`${API_URL}/gyms/${gymId}/reviews/${reviewId}`, review);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async deleteReview(gymId: string, reviewId: string): Promise<ApiResponse<{ message: string }>> {
    try {
      const response = await axios.delete(`${API_URL}/gyms/${gymId}/reviews/${reviewId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async getUserReviews(): Promise<ApiResponse<Review[]>> {
    try {
      const response = await axios.get(`${API_URL}/user/reviews`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};
