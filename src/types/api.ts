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
