import api from './config';

export interface GymFilters {
  location?: string;
  facilities?: string[];
  priceRange?: {
    min: number;
    max: number;
  };
  rating?: number;
  amenities?: string[];
}

export interface Facility {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface Schedule {
  day: string;
  openTime: string;
  closeTime: string;
}

export interface Gym {
  id: string;
  name: string;
  description: string;
  location: string;
  image: string;
  rating: number;
  reviewCount: number;
  memberCount: number;
  facilities: Facility[];
  schedule: Schedule[];
  amenities: string[];
  pricing: {
    monthly: number;
    annual: number;
  };
  contact: {
    phone: string;
    email: string;
    website: string;
  };
  coordinates: {
    lat: number;
    lng: number;
  };
}

export interface GymCreateData {
  name: string;
  description: string;
  location: string;
  image: string;
  facilities: string[];
  schedule: Schedule[];
  amenities: string[];
  pricing: {
    monthly: number;
    annual: number;
  };
  contact: {
    phone: string;
    email: string;
    website: string;
  };
  coordinates: {
    lat: number;
    lng: number;
  };
}

export const gymsApi = {
  getAll: async (filters?: GymFilters) => {
    const response = await api.get<Gym[]>('/gyms', {
      params: filters,
    });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get<Gym>(`/gyms/${id}`);
    return response.data;
  },

  create: async (data: GymCreateData) => {
    const response = await api.post<Gym>('/gyms', data);
    return response.data;
  },

  update: async (id: string, data: Partial<GymCreateData>) => {
    const response = await api.put<Gym>(`/gyms/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    await api.delete(`/gyms/${id}`);
  },

  getFacilities: async () => {
    const response = await api.get<Facility[]>('/gyms/facilities');
    return response.data;
  },

  getSchedule: async (id: string) => {
    const response = await api.get<Schedule[]>(`/gyms/${id}/schedule`);
    return response.data;
  },

  updateSchedule: async (id: string, schedule: Schedule[]) => {
    const response = await api.put(`/gyms/${id}/schedule`, { schedule });
    return response.data;
  },

  getClasses: async (id: string) => {
    const response = await api.get(`/gyms/${id}/classes`);
    return response.data;
  },

  getInstructors: async (id: string) => {
    const response = await api.get(`/gyms/${id}/instructors`);
    return response.data;
  },

  getReviews: async (id: string) => {
    const response = await api.get(`/gyms/${id}/reviews`);
    return response.data;
  },

  addReview: async (id: string, rating: number, comment: string) => {
    const response = await api.post(`/gyms/${id}/reviews`, {
      rating,
      comment,
    });
    return response.data;
  },

  getNearby: async (lat: number, lng: number, radius?: number) => {
    const response = await api.get<Gym[]>('/gyms/nearby', {
      params: { lat, lng, radius },
    });
    return response.data;
  },

  getPopular: async () => {
    const response = await api.get<Gym[]>('/gyms/popular');
    return response.data;
  },

  searchByLocation: async (location: string) => {
    const response = await api.get<Gym[]>(`/gyms/search`, {
      params: { location },
    });
    return response.data;
  },
};
