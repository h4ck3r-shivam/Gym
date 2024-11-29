import axios from 'axios';
import { ApiResponse, Review } from '../../types';
import { API_URL } from './config';

const reviewAPI = {
  getGymReviews: async (gymId: string): Promise<ApiResponse<Review[]>> => {
    const response = await axios.get(`${API_URL}/gyms/${gymId}/reviews`);
    return response.data;
  },

  getUserReviews: async (): Promise<ApiResponse<Review[]>> => {
    const response = await axios.get(`${API_URL}/reviews/user`);
    return response.data;
  },

  createReview: async (gymId: string, data: { rating: number; comment: string }): Promise<ApiResponse<Review>> => {
    const response = await axios.post(`${API_URL}/gyms/${gymId}/reviews`, data);
    return response.data;
  },

  updateReview: async (
    gymId: string,
    reviewId: string,
    data: { rating?: number; comment?: string }
  ): Promise<ApiResponse<Review>> => {
    const response = await axios.put(`${API_URL}/gyms/${gymId}/reviews/${reviewId}`, data);
    return response.data;
  },

  deleteReview: async (gymId: string, reviewId: string): Promise<ApiResponse<{ message: string }>> => {
    const response = await axios.delete(`${API_URL}/gyms/${gymId}/reviews/${reviewId}`);
    return response.data;
  }
};

export { reviewAPI };
