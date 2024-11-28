import api from './config';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  name: string;
  phoneNumber?: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    membershipStatus?: string;
  };
}

export const authApi = {
  login: async (credentials: LoginCredentials) => {
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    return response.data;
  },

  register: async (data: RegisterData) => {
    const response = await api.post<AuthResponse>('/auth/register', data);
    return response.data;
  },

  logout: async () => {
    await api.post('/auth/logout');
    localStorage.removeItem('token');
  },

  forgotPassword: async (email: string) => {
    await api.post('/auth/forgot-password', { email });
  },

  resetPassword: async (token: string, password: string) => {
    await api.post('/auth/reset-password', { token, password });
  },

  verifyEmail: async (token: string) => {
    await api.post('/auth/verify-email', { token });
  },

  refreshToken: async () => {
    const response = await api.post<{ token: string }>('/auth/refresh-token');
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await api.get<AuthResponse['user']>('/auth/me');
    return response.data;
  },

  updateProfile: async (data: Partial<AuthResponse['user']>) => {
    const response = await api.put<AuthResponse['user']>('/auth/profile', data);
    return response.data;
  },

  changePassword: async (currentPassword: string, newPassword: string) => {
    await api.put('/auth/change-password', {
      currentPassword,
      newPassword,
    });
  },
};
