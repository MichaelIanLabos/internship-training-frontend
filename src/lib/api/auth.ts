import apiClient from './client';
import { LoginRequest, LoginResponse, RegisterRequest, User } from '@/types/auth';

/**
 * Authentication API Functions
 *
 * TODO for Interns:
 * Implement API calls to the backend authentication endpoints.
 *
 * All functions should use the apiClient (which has interceptors configured).
 *
 * Backend endpoints:
 * - POST /api/auth/register/ - Register new user
 * - POST /api/auth/login/ - Login and get JWT tokens
 * - GET /api/auth/me/ - Get current user (requires auth)
 * - POST /api/auth/refresh/ - Refresh access token
 */

export const authApi = {
  /**
   * TODO: Implement login
   *
   * @param credentials - { email, password }
   * @returns Promise<LoginResponse> - { user, tokens: { access, refresh } }
   *
   * Steps:
   * 1. Make POST request to /api/auth/login/
   * 2. Return response.data
   *
   * Example:
   * const response = await apiClient.post('/api/auth/login/', credentials);
   * return response.data;
   */
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await apiClient.post('/api/auth/login/', credentials);
    return response.data as LoginResponse;
  },

  /**
   * TODO: Implement registration
   *
   * @param data - { email, first_name, last_name, password, password_confirm }
   * @returns Promise<{ user: User; message: string }>
   *
   * Steps:
   * 1. Make POST request to /api/auth/register/
   * 2. Return response.data
   */
  register: async (data: RegisterRequest): Promise<{ user: User; message: string }> => {
    const response = await apiClient.post('/api/auth/register/', data);
    return response.data;
  },

  /**
   * TODO: Implement get current user
   *
   * @returns Promise<User>
   *
   * Steps:
   * 1. Make GET request to /api/auth/me/
   * 2. Return response.data
   *
   * Note: This requires authentication!
   * The access token will be added automatically by the request interceptor.
   */
  getCurrentUser: async (): Promise<User> => {
    const response = await apiClient.get('/api/auth/me/');
    return response.data as User;
  },

  /**
   * Optional: Implement logout
   * For now, just clear tokens on the frontend
   */
  logout: async (): Promise<void> => {
    // Optional: Call backend logout endpoint if you implement one
  },
};
