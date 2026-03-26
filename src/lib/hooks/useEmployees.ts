// Imports
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { employeeApi } from '@/lib/api/employee';
import {
  Employee,
  EmployeeCreateRequest,
  EmployeeUpdateRequest,
  PaginatedResponse,
} from '@/types/employee';

// Constants
const EMPLOYEE_QUERY_KEY = 'employees';

// Query Hook
export function useEmployees(params: {
  page: number;
  page_size: number;
  search?: string;
  show_deleted?: boolean;
  enabled?: boolean;
}) {
  const { enabled = true, ...apiParams } = params;

  return useQuery<PaginatedResponse<Employee>>({
    queryKey: [EMPLOYEE_QUERY_KEY, apiParams],
    queryFn: () => employeeApi.list(apiParams),
    enabled,
  });
}

// Mutation Hooks
export function useCreateEmployee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: EmployeeCreateRequest) => employeeApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [EMPLOYEE_QUERY_KEY] });
    },
  });
}

export function useUpdateEmployee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: EmployeeUpdateRequest }) =>
      employeeApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [EMPLOYEE_QUERY_KEY] });
    },
  });
}

export function useDeleteEmployee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => employeeApi.delete([id]),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [EMPLOYEE_QUERY_KEY] });
    },
  });
}

export function useBulkDeleteEmployees() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ids: number[]) => employeeApi.delete(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [EMPLOYEE_QUERY_KEY] });
    },
  });
}

export function useRestoreEmployee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => employeeApi.restore(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [EMPLOYEE_QUERY_KEY] });
    },
  });
}

export function useBulkRestoreEmployees() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (ids: number[]) => {
      const results = await Promise.all(ids.map((id) => employeeApi.restore(id)));
      return results;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [EMPLOYEE_QUERY_KEY] });
    },
  });
}
