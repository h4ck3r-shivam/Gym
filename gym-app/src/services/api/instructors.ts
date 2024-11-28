import api from './config';

export interface InstructorFilters {
  specialties?: string[];
  availability?: string[];
  rating?: number;
  gym?: string;
}

export interface Certification {
  name: string;
  issuer: string;
  year: number;
  expiryDate?: string;
}

export interface Instructor {
  id: string;
  name: string;
  email: string;
  phone: string;
  bio: string;
  image: string;
  specialties: string[];
  experience: number;
  rating: number;
  reviewCount: number;
  certifications: Certification[];
  availability: {
    day: string;
    slots: {
      start: string;
      end: string;
    }[];
  }[];
  socialMedia?: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
    linkedin?: string;
  };
  gyms: {
    id: string;
    name: string;
  }[];
}

export interface InstructorCreateData {
  name: string;
  email: string;
  phone: string;
  bio: string;
  image: string;
  specialties: string[];
  experience: number;
  certifications: Certification[];
  availability: {
    day: string;
    slots: {
      start: string;
      end: string;
    }[];
  }[];
  socialMedia?: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
    linkedin?: string;
  };
  gymIds: string[];
}

export const instructorsApi = {
  getAll: async (filters?: InstructorFilters) => {
    const response = await api.get<Instructor[]>('/instructors', {
      params: filters,
    });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get<Instructor>(`/instructors/${id}`);
    return response.data;
  },

  create: async (data: InstructorCreateData) => {
    const response = await api.post<Instructor>('/instructors', data);
    return response.data;
  },

  update: async (id: string, data: Partial<InstructorCreateData>) => {
    const response = await api.put<Instructor>(`/instructors/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    await api.delete(`/instructors/${id}`);
  },

  getSchedule: async (id: string, date?: string) => {
    const response = await api.get(`/instructors/${id}/schedule`, {
      params: { date },
    });
    return response.data;
  },

  updateSchedule: async (
    id: string,
    availability: Instructor['availability']
  ) => {
    const response = await api.put(`/instructors/${id}/schedule`, {
      availability,
    });
    return response.data;
  },

  getClasses: async (id: string) => {
    const response = await api.get(`/instructors/${id}/classes`);
    return response.data;
  },

  getReviews: async (id: string) => {
    const response = await api.get(`/instructors/${id}/reviews`);
    return response.data;
  },

  addReview: async (id: string, rating: number, comment: string) => {
    const response = await api.post(`/instructors/${id}/reviews`, {
      rating,
      comment,
    });
    return response.data;
  },

  getCertifications: async (id: string) => {
    const response = await api.get(`/instructors/${id}/certifications`);
    return response.data;
  },

  addCertification: async (id: string, certification: Certification) => {
    const response = await api.post(`/instructors/${id}/certifications`, certification);
    return response.data;
  },

  updateCertification: async (
    id: string,
    certificationId: string,
    certification: Partial<Certification>
  ) => {
    const response = await api.put(
      `/instructors/${id}/certifications/${certificationId}`,
      certification
    );
    return response.data;
  },

  deleteCertification: async (id: string, certificationId: string) => {
    await api.delete(`/instructors/${id}/certifications/${certificationId}`);
  },

  getPopular: async () => {
    const response = await api.get<Instructor[]>('/instructors/popular');
    return response.data;
  },

  searchBySpecialty: async (specialty: string) => {
    const response = await api.get<Instructor[]>(`/instructors/search`, {
      params: { specialty },
    });
    return response.data;
  },

  getByGym: async (gymId: string) => {
    const response = await api.get<Instructor[]>(`/instructors/gym/${gymId}`);
    return response.data;
  },
};
