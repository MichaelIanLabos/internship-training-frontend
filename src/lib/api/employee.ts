import apiClient from './client';
import {
  Employee,
  EmployeeCreateRequest,
  EmployeeUpdateRequest,
  PaginatedResponse,
} from '@/types/employee';

// API Methods
export const employeeApi = {
  // List employees
  list: async (params: {
    page?: number;
    page_size?: number;
    search?: string;
    show_deleted?: boolean;
  }): Promise<PaginatedResponse<Employee>> => {
    const response = await apiClient.get('/api/employees/', { params });
    return response.data;
  },

  // Create employee
  create: async (data: EmployeeCreateRequest): Promise<Employee> => {
    const response = await apiClient.post('/api/employees/', data);
    return response.data;
  },

  // Update employee
  update: async (
    id: number,
    data: EmployeeUpdateRequest
  ): Promise<Employee> => {
    const response = await apiClient.patch(`/api/employees/${id}/`, data);
    return response.data;
  },

  // Delete employee(s)
  delete: async (
    employeeIds: number[]
  ): Promise<{ detail: string }> => {
    const response = await apiClient.delete('/api/employees/', {
      data: { employee_ids: employeeIds },
    });
    return response.data;
  },

  // Restore employee
  restore: async (id: number): Promise<Employee> => {
    const response = await apiClient.post(`/api/employees/${id}/restore/`);
    return response.data;
  },
};
