import axios from 'axios';
import { ApiResponse, Booking, BookingRequest, BookingQueryParams } from '../../types';
import { API_URL } from './config';

const bookingAPI = {
  getAllBookings: async (params?: BookingQueryParams): Promise<ApiResponse<Booking[]>> => {
    const response = await axios.get(`${API_URL}/bookings`, { params });
    return response.data;
  },

  getUserBookings: async (): Promise<ApiResponse<Booking[]>> => {
    const response = await axios.get(`${API_URL}/bookings/user`);
    return response.data;
  },

  getOwnerBookings: async (): Promise<ApiResponse<Booking[]>> => {
    const response = await axios.get(`${API_URL}/bookings/owner`);
    return response.data;
  },

  getBookingById: async (bookingId: string): Promise<ApiResponse<Booking>> => {
    const response = await axios.get(`${API_URL}/bookings/${bookingId}`);
    return response.data;
  },

  createBooking: async (data: BookingRequest): Promise<ApiResponse<Booking>> => {
    const response = await axios.post(`${API_URL}/bookings`, data);
    return response.data;
  },

  updateBookingStatus: async (
    bookingId: string,
    status: 'confirmed' | 'cancelled'
  ): Promise<ApiResponse<Booking>> => {
    const response = await axios.put(`${API_URL}/bookings/${bookingId}/status`, { status });
    return response.data;
  },

  cancelBooking: async (bookingId: string): Promise<ApiResponse<Booking>> => {
    const response = await axios.put(`${API_URL}/bookings/${bookingId}/cancel`);
    return response.data;
  },

  getBookingHistory: async (): Promise<ApiResponse<Booking[]>> => {
    const response = await axios.get(`${API_URL}/bookings/history`);
    return response.data;
  }
};

export { bookingAPI };
