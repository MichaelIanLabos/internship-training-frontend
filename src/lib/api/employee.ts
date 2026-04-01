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

  // Seed sample employees
  seed: async (): Promise<Employee[]> => {
    const samples: EmployeeCreateRequest[] = [
      { first_name: 'Sarah', last_name: 'Ahmed', email: 'sarah.ahmed@company.com', employment_status: 'active' },
      { first_name: 'Mohammed', last_name: 'Khan', email: 'mohammed.khan@company.com', employment_status: 'active' },
      { first_name: 'Fatima', last_name: 'Noor', email: 'fatima.noor@company.com', employment_status: 'active' },
      { first_name: 'John', last_name: 'Davis', email: 'john.davis@company.com', employment_status: 'active' },
      { first_name: 'Lisa', last_name: 'Wong', email: 'lisa.wong@company.com', employment_status: 'active' },
      { first_name: 'Carlos', last_name: 'Rivera', email: 'carlos.rivera@company.com', employment_status: 'active' },
      { first_name: 'Aisha', last_name: 'Malik', email: 'aisha.malik@company.com', employment_status: 'active' },
      { first_name: 'James', last_name: 'Chen', email: 'james.chen@company.com', employment_status: 'inactive' },
      { first_name: 'Maria', last_name: 'Santos', email: 'maria.santos@company.com', employment_status: 'active' },
      { first_name: 'Daniel', last_name: 'Kim', email: 'daniel.kim@company.com', employment_status: 'active' },
    ];
    const results: Employee[] = [];
    for (const data of samples) {
      try {
        const emp = await employeeApi.create(data);
        results.push(emp);
      } catch {
        // skip duplicates
      }
    }
    return results;
  },
};
