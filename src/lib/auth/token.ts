/**
 * Token Manager
 *
 * TODO for Interns:
 * Implement token management functions for JWT authentication.
 *
 * Requirements:
 * - Store access and refresh tokens securely
 * - Retrieve tokens when needed
 * - Clear tokens on logout
 * - Check if user has valid tokens
 *
 * For this training, use localStorage (note: in production, consider httpOnly cookies)
 *
 * localStorage API:
 * - localStorage.setItem(key, value)
 * - localStorage.getItem(key)
 * - localStorage.removeItem(key)
 *
 * Make sure to check if window is defined (for Next.js SSR)
 */

const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

export const tokenManager = {
  /**
   * TODO: Get access token from localStorage
   * Return null if not found or if running on server
   */
  getAccessToken: (): string | null => {
    // Your code here
    return null;
  },

  /**
   * TODO: Get refresh token from localStorage
   * Return null if not found or if running on server
   */
  getRefreshToken: (): string | null => {
    // Your code here
    return null;
  },

  /**
   * TODO: Save both tokens to localStorage
   * Check if window is defined first
   */
  setTokens: (access: string, refresh: string): void => {
    // Your code here
  },

  /**
   * TODO: Remove both tokens from localStorage
   * Check if window is defined first
   */
  clearTokens: (): void => {
    // Your code here
  },

  /**
   * TODO: Check if user has tokens
   * Return true if access token exists
   */
  hasTokens: (): boolean => {
    // Your code here
    return false;
  },
};
