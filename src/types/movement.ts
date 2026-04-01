import { MovementType, MovementStatus } from '@/lib/constants/movement';

export interface Movement {
  id: number;
  employee: number;
  employee_code?: string;
  employee_first_name: string;
  employee_last_name: string;
  movement_type: MovementType;
  status: MovementStatus;
  remarks: string;
  requested_by: number;
  requested_by_first_name: string;
  requested_by_last_name: string;
  approved_by?: number | null;
  approved_by_first_name?: string;
  approved_by_last_name?: string;
  effective_date?: string;
  current_department?: string;
  target_department?: string;
  current_position?: string;
  new_position?: string;
  created_at: string;
  updated_at?: string;
}

export interface MovementCreateRequest {
  employee: number;
  movement_type: MovementType | '';
  remarks?: string;
  effective_date?: string;
  current_department?: string;
  target_department?: string;
  current_position?: string;
  new_position?: string;
}
