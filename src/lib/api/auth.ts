import apiClient from './client';
import { LoginRequest, LoginResponse, RegisterRequest, User } from '@/types/auth';

export const authApi = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await apiClient.post('/api/auth/login/', credentials);
    return response.data;
  },

  register: async (data: RegisterRequest): Promise<{ user: User; message: string }> => {
    const response = await apiClient.post('/api/auth/register/', data);
    return response.data;
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await apiClient.get('/api/auth/me/');
    return response.data;
  },

  logout: async (): Promise<void> => {
    // Optional: Call backend logout endpoint if you implement it
    // await apiClient.post('/api/auth/logout/');
  },
};
