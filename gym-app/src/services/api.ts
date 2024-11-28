import axios from 'axios';
import {
  User,
  Gym,
  Slot,
  Booking,
  LoginCredentials,
  RegisterData,
  UpdateProfileData,
  ChangePasswordData,
  ApiResponse,
  BookingRequest,
  BookingStatus,
  PaymentStatus,
} from '../types';

interface BookingQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  paymentStatus?: string;
  startDate?: string;
  endDate?: string;
}

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  register: (data: RegisterData) => 
    api.post<ApiResponse<{ user: User; token: string }>>('/auth/register', data),
  
  login: (data: LoginCredentials) => 
    api.post<ApiResponse<{ user: User; token: string }>>('/auth/login', data),
  
  getCurrentUser: () => 
    api.get<ApiResponse<{ user: User }>>('/auth/me'),
  
  updateProfile: (data: UpdateProfileData) => {
    const formData = new FormData();
    if (data.firstName) formData.append('firstName', data.firstName);
    if (data.lastName) formData.append('lastName', data.lastName);
    if (data.email) formData.append('email', data.email);
    if (data.phoneNumber) formData.append('phoneNumber', data.phoneNumber);
    if (data.avatar) formData.append('avatar', data.avatar);
    
    return api.patch<ApiResponse<{ user: User }>>('/auth/update-profile', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  changePassword: (data: ChangePasswordData) => 
    api.patch<ApiResponse<void>>('/auth/change-password', data),

  forgotPassword: (email: string) =>
    api.post<ApiResponse<void>>('/auth/forgot-password', { email }),

  resetPassword: (token: string, password: string) =>
    api.post<ApiResponse<void>>('/auth/reset-password', { token, password }),
};

// Gym API
export const gymAPI = {
  createGym: (data: Partial<Gym>) => 
    api.post<ApiResponse<{ gym: Gym }>>('/gyms', data),
  
  getAllGyms: () => 
    api.get<ApiResponse<{ gyms: Gym[] }>>('/gyms'),
  
  getGym: (id: string) => 
    api.get<ApiResponse<{ gym: Gym }>>(`/gyms/${id}`),
  
  updateGym: (id: string, data: Partial<Gym>) => 
    api.patch<ApiResponse<{ gym: Gym }>>(`/gyms/${id}`, data),
  
  deleteGym: (id: string) => 
    api.delete<ApiResponse<void>>(`/gyms/${id}`),
  
  getMyGyms: () => 
    api.get<ApiResponse<{ gyms: Gym[] }>>('/gyms/my/gyms'),
  
  searchGyms: (params: { query?: string; city?: string }) => 
    api.get<ApiResponse<{ gyms: Gym[] }>>('/gyms/search', { params }),
  
  getAvailableSlots: (gymId: string, date: string) =>
    api.get<ApiResponse<{ slots: Slot[] }>>(`/gyms/${gymId}/slots`, { params: { date } }),
};

// Slot API
export const slotAPI = {
  createSlot: (gymId: string, data: Partial<Slot>) => 
    api.post<ApiResponse<{ slot: Slot }>>(`/slots/${gymId}`, data),
  
  getGymSlots: (gymId: string) => 
    api.get<ApiResponse<{ slots: Slot[] }>>(`/slots/gym/${gymId}`),
  
  updateSlot: (id: string, data: Partial<Slot>) => 
    api.patch<ApiResponse<{ slot: Slot }>>(`/slots/${id}`, data),
  
  deleteSlot: (id: string) => 
    api.delete<ApiResponse<void>>(`/slots/${id}`),
  
  getAvailableSlots: (gymId: string, date?: string) =>
    api.get<ApiResponse<{ slots: Slot[] }>>(`/slots/available/${gymId}`, { params: { date } }),
};

// Booking API
export const bookingAPI = {
  createBooking: (data: BookingRequest) =>
    api.post<ApiResponse<{ booking: Booking }>>('/bookings', data),

  fetchBookings: async (
    page = 1, 
    limit = 10, 
    filters: {
      status?: BookingStatus, 
      paymentStatus?: PaymentStatus, 
      startDate?: string, 
      endDate?: string
    } = {}
  ): Promise<{ bookings: Booking[], total: number }> => {
    try {
      const response = await api.get(`${API_URL}/bookings`, {
        params: {
          page,
          limit,
          ...filters
        }
      });
      return response.data;
    } catch (error) {
      // handleApiError(error);
      throw error;
    }
  },

  getMyBookings: (params?: BookingQueryParams) =>
    api.get<ApiResponse<{ bookings: Booking[]; total: number }>>('/bookings/me', { params }),

  getAllBookings: (params?: BookingQueryParams) =>
    api.get<ApiResponse<{ bookings: Booking[]; total: number }>>('/bookings', { params }),

  cancelBooking: (id: string) =>
    api.delete<ApiResponse<{ booking: Booking }>>(`/bookings/${id}`),

  createPaymentIntent: (slotId: string) =>
    api.post<ApiResponse<{ clientSecret: string }>>('/bookings/payment-intent', { slotId }),

  confirmPayment: (bookingId: string, paymentIntentId: string) =>
    api.post<ApiResponse<{ booking: Booking }>>(`/bookings/${bookingId}/confirm`, {
      paymentIntentId,
    }),
};

export default api;
