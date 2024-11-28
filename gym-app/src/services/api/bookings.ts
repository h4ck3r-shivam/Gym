import api from './config';

export interface BookingCreateData {
  classId: string;
  date: string;
  notes?: string;
}

export interface BookingUpdateData {
  notes?: string;
  status?: 'confirmed' | 'cancelled' | 'rescheduled';
}

export interface BookingFilters {
  status?: string;
  fromDate?: string;
  toDate?: string;
  classId?: string;
  gymId?: string;
}

export interface Booking {
  id: string;
  userId: string;
  classId: string;
  className: string;
  date: string;
  time: string;
  status: string;
  notes?: string;
  instructor: {
    id: string;
    name: string;
  };
  gym: {
    id: string;
    name: string;
    location: string;
  };
  createdAt: string;
  updatedAt: string;
}

export const bookingsApi = {
  getAll: async (filters?: BookingFilters) => {
    const response = await api.get<Booking[]>('/bookings', {
      params: filters,
    });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get<Booking>(`/bookings/${id}`);
    return response.data;
  },

  create: async (data: BookingCreateData) => {
    const response = await api.post<Booking>('/bookings', data);
    return response.data;
  },

  update: async (id: string, data: BookingUpdateData) => {
    const response = await api.put<Booking>(`/bookings/${id}`, data);
    return response.data;
  },

  cancel: async (id: string, reason?: string) => {
    const response = await api.put<Booking>(`/bookings/${id}/cancel`, { reason });
    return response.data;
  },

  reschedule: async (id: string, newDate: string) => {
    const response = await api.put<Booking>(`/bookings/${id}/reschedule`, {
      newDate,
    });
    return response.data;
  },

  getUpcoming: async () => {
    const response = await api.get<Booking[]>('/bookings/upcoming');
    return response.data;
  },

  getPast: async () => {
    const response = await api.get<Booking[]>('/bookings/past');
    return response.data;
  },

  addReview: async (id: string, rating: number, comment: string) => {
    const response = await api.post(`/bookings/${id}/review`, {
      rating,
      comment,
    });
    return response.data;
  },

  getReviews: async (id: string) => {
    const response = await api.get(`/bookings/${id}/reviews`);
    return response.data;
  },
};
