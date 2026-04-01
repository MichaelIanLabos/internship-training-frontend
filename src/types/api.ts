export interface ApiError {
  error: boolean;
  status_code: number;
  message?: string;
  errors?: Record<string, string[]>;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  total_records: number;
  total_pages: number;
  current_page: number;
  records: T[];
}
