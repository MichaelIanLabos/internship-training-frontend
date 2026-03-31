import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { movementApi } from '@/lib/api/movement';
import { getMockMovements, getMockMovementById } from '@/lib/mock/movements';
import { Movement, MovementCreateRequest } from '@/types/movement';
import { PaginatedResponse } from '@/types/employee';

const USE_MOCK_DATA = true;

const MOVEMENT_QUERY_KEY = 'movements';

export function useMovements(params: {
  page: number;
  page_size: number;
  status?: string;
  movement_type?: string;
  search?: string;
  enabled?: boolean;
}) {
  const { enabled = true, ...apiParams } = params;

  return useQuery<PaginatedResponse<Movement>>({
    queryKey: [MOVEMENT_QUERY_KEY, apiParams.page, apiParams.page_size, apiParams.status ?? 'all', apiParams.movement_type ?? 'all', apiParams.search ?? ''],
    queryFn: () =>
      USE_MOCK_DATA
        ? Promise.resolve(getMockMovements(apiParams))
        : movementApi.list(apiParams),
    enabled,
  });
}

export function useMovement(id: number, enabled = true) {
  return useQuery<Movement | null>({
    queryKey: [MOVEMENT_QUERY_KEY, 'detail', id],
    queryFn: () =>
      USE_MOCK_DATA
        ? Promise.resolve(getMockMovementById(id))
        : movementApi.getById(id),
    enabled,
  });
}

export function useDeleteMovement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => movementApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [MOVEMENT_QUERY_KEY] });
    },
  });
}

export function useCreateMovement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: MovementCreateRequest) => movementApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [MOVEMENT_QUERY_KEY] });
    },
  });
}

export function useApproveMovement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => movementApi.approve(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [MOVEMENT_QUERY_KEY] });
    },
  });
}

export function useRejectMovement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => movementApi.reject(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [MOVEMENT_QUERY_KEY] });
    },
  });
}
