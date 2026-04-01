import apiClient from './client';
import { Movement, MovementCreateRequest } from '@/types/movement';
import { PaginatedResponse } from '@/types/employee';

export const movementApi = {
  list: async (params: {
    page?: number;
    page_size?: number;
    status?: string;
    movement_type?: string;
    search?: string;
  }): Promise<PaginatedResponse<Movement>> => {
    const response = await apiClient.get('/api/movements/', { params });
    return response.data;
  },

  getById: async (id: number): Promise<Movement> => {
    const response = await apiClient.get(`/api/movements/${id}/`);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/movements/${id}/`);
  },

  create: async (data: MovementCreateRequest): Promise<Movement> => {
    const response = await apiClient.post('/api/movements/', data);
    return response.data;
  },

  update: async (id: number, data: Partial<MovementCreateRequest>): Promise<Movement> => {
    const response = await apiClient.patch(`/api/movements/${id}/`, data);
    return response.data;
  },

  approve: async (id: number): Promise<Movement> => {
    const response = await apiClient.patch(`/api/movements/${id}/approve/`);
    return response.data;
  },

  reject: async (id: number, remarks?: string): Promise<Movement> => {
    const response = await apiClient.patch(`/api/movements/${id}/reject/`, { remarks });
    return response.data;
  },
};
