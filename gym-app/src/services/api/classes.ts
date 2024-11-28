import api from './config';

export interface ClassFilters {
  type?: string;
  level?: string;
  instructor?: string;
  gym?: string;
  date?: string;
  fromTime?: string;
  toTime?: string;
  availability?: boolean;
}

export interface Class {
  id: string;
  name: string;
  description: string;
  type: string;
  level: string;
  duration: number;
  capacity: number;
  enrolled: number;
  price: number;
  date: string;
  time: string;
  instructor: {
    id: string;
    name: string;
    image: string;
    rating: number;
  };
  gym: {
    id: string;
    name: string;
    location: string;
  };
  image?: string;
  requirements?: string[];
  benefits?: string[];
  equipment?: string[];
  schedule?: {
    day: string;
    time: string;
  }[];
}

export interface ClassCreateData {
  name: string;
  description: string;
  type: string;
  level: string;
  duration: number;
  capacity: number;
  price: number;
  instructorId: string;
  gymId: string;
  schedule: {
    day: string;
    time: string;
  }[];
  image?: string;
  requirements?: string[];
  benefits?: string[];
  equipment?: string[];
}

export const classesApi = {
  getAll: async (filters?: ClassFilters) => {
    const response = await api.get<Class[]>('/classes', {
      params: filters,
    });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get<Class>(`/classes/${id}`);
    return response.data;
  },

  create: async (data: ClassCreateData) => {
    const response = await api.post<Class>('/classes', data);
    return response.data;
  },

  update: async (id: string, data: Partial<ClassCreateData>) => {
    const response = await api.put<Class>(`/classes/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    await api.delete(`/classes/${id}`);
  },

  getSchedule: async (id: string) => {
    const response = await api.get(`/classes/${id}/schedule`);
    return response.data;
  },

  updateSchedule: async (id: string, schedule: Class['schedule']) => {
    const response = await api.put(`/classes/${id}/schedule`, { schedule });
    return response.data;
  },

  getAttendees: async (id: string) => {
    const response = await api.get(`/classes/${id}/attendees`);
    return response.data;
  },

  addAttendee: async (id: string, userId: string) => {
    const response = await api.post(`/classes/${id}/attendees`, { userId });
    return response.data;
  },

  removeAttendee: async (id: string, userId: string) => {
    await api.delete(`/classes/${id}/attendees/${userId}`);
  },

  getReviews: async (id: string) => {
    const response = await api.get(`/classes/${id}/reviews`);
    return response.data;
  },

  getPopular: async () => {
    const response = await api.get<Class[]>('/classes/popular');
    return response.data;
  },

  getUpcoming: async () => {
    const response = await api.get<Class[]>('/classes/upcoming');
    return response.data;
  },

  searchByInstructor: async (instructorId: string) => {
    const response = await api.get<Class[]>(`/classes/instructor/${instructorId}`);
    return response.data;
  },

  searchByGym: async (gymId: string) => {
    const response = await api.get<Class[]>(`/classes/gym/${gymId}`);
    return response.data;
  },
};
