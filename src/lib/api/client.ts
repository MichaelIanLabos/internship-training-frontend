import axios from 'axios';
import { tokenManager } from '@/lib/auth/token';

/**
 * API Client Configuration
 *
 * TODO for Interns:
 * Setup Axios client with:
 * 1. Request interceptor - add JWT token to headers
 * 2. Response interceptor - handle token refresh on 401 errors
 *
 * This is crucial for automatic authentication handling!
 */

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request Interceptor
 *
 * TODO: Add access token to every request
 * Steps:
 * 1. Get access token using tokenManager.getAccessToken()
 * 2. If token exists, add to headers: Authorization: Bearer <token>
 * 3. Return the modified config
 *
 * Axios Interceptor docs:
 * https://axios-http.com/docs/interceptors
 */
apiClient.interceptors.request.use(
  (config) => {
    // TODO: Add token to request headers
    // const token = tokenManager.getAccessToken();
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Response Interceptor
 *
 * TODO: Handle token refresh automatically
 * Steps:
 * 1. If response is successful, return it
 * 2. If error is 401 (Unauthorized) and we haven't retried yet:
 *    a. Get refresh token
 *    b. Call /api/auth/refresh/ endpoint
 *    c. Save new access token
 *    d. Retry original request with new token
 * 3. If refresh fails, clear tokens and redirect to login
 *
 * This is advanced! Take your time to understand the flow.
 *
 * Resources:
 * - Axios response interceptor: https://axios-http.com/docs/interceptors
 * - HTTP 401 status: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/401
 */
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    // TODO: Implement automatic token refresh logic
    // Hints:
    // - Check error.response?.status === 401
    // - Check if originalRequest._retry to avoid infinite loops
    // - Use axios.post directly (not apiClient) for refresh call
    // - Update Authorization header on original request
    // - Return apiClient(originalRequest) to retry

    return Promise.reject(error);
  }
);

export default apiClient;
