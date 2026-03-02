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
    const token = tokenManager.getAccessToken();
    if (token) {
      if (!config.headers) config.headers = {} as any;
      (config.headers as any).Authorization = `Bearer ${token}`;
    }
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
    const originalRequest = error.config;
    const status = error.response?.status;

    if (status === 401 && originalRequest && !(originalRequest as any)._retry) {
      (originalRequest as any)._retry = true;
      const refreshToken = tokenManager.getRefreshToken();

      if (!refreshToken) {
        tokenManager.clearTokens();
        if (typeof window !== 'undefined') window.location.href = '/login';
        return Promise.reject(error);
      }

      try {
        const refreshUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/auth/refresh/`;
        const { data } = await axios.post(refreshUrl, { refresh: refreshToken });

        const newAccess = data?.access ?? data?.tokens?.access;
        const newRefresh = data?.refresh ?? data?.tokens?.refresh ?? refreshToken;

        if (newAccess) {
          tokenManager.setTokens(newAccess, newRefresh);
          if (!originalRequest.headers) originalRequest.headers = {};
          originalRequest.headers.Authorization = `Bearer ${newAccess}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        tokenManager.clearTokens();
        if (typeof window !== 'undefined') window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
