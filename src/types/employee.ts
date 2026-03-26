// Base Employee
export interface Employee {
  id: number;
  employee_code: string;
  first_name: string;
  last_name: string;
  email: string;
  employment_status: string;
  created_at: string;
}

// Request Types
export interface EmployeeCreateRequest {
  first_name: string;
  last_name: string;
  email: string;
  employment_status: string;
}

export interface EmployeeUpdateRequest {
  first_name?: string;
  last_name?: string;
  email?: string;
  employment_status?: string;
}

// Response Types
export interface PaginatedResponse<T> {
  total_records: number;
  total_pages: number;
  current_page: number;
  records: T[];
}
