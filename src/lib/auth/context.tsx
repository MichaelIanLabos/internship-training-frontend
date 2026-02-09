'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { User } from '@/types/auth';
import { authApi } from '@/lib/api/auth';
import { tokenManager } from './token';

/**
 * Authentication Context
 *
 * TODO for Interns:
 * Implement global authentication state management using React Context.
 *
 * This context will:
 * - Store current user state
 * - Provide login/logout functions
 * - Check authentication status on app load
 * - Be accessible from any component
 *
 * Resources:
 * - React Context: https://react.dev/reference/react/useContext
 * - useState: https://react.dev/reference/react/useState
 * - useEffect: https://react.dev/reference/react/useEffect
 */

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  /**
   * TODO: Define state variables
   * - user: User | null (current authenticated user)
   * - isLoading: boolean (true while checking authentication)
   */
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * TODO: Load user on mount
   *
   * Use useEffect to check if user is authenticated when component mounts.
   *
   * Steps:
   * 1. Check if access token exists
   * 2. If yes, call authApi.getCurrentUser()
   * 3. Set user state if successful
   * 4. If error, clear tokens
   * 5. Set isLoading to false
   *
   * This runs once when the app starts!
   */
  useEffect(() => {
    const loadUser = async () => {
      try {
        // TODO: Implement user loading logic
        // const token = tokenManager.getAccessToken();
        // if (token) {
        //   const currentUser = await authApi.getCurrentUser();
        //   setUser(currentUser);
        // }
      } catch (error) {
        console.error('Failed to load user:', error);
        tokenManager.clearTokens();
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  /**
   * TODO: Implement login function
   *
   * Steps:
   * 1. Call authApi.login(email, password)
   * 2. Save tokens using tokenManager.setTokens()
   * 3. Set user state with the returned user data
   *
   * This function will be called from the login form!
   */
  const login = async (email: string, password: string) => {
    // Your code here
    throw new Error('Not implemented');
  };

  /**
   * TODO: Implement logout function
   *
   * Steps:
   * 1. Clear tokens using tokenManager.clearTokens()
   * 2. Set user state to null
   * 3. Redirect to login page (window.location.href = '/login')
   */
  const logout = () => {
    // Your code here
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Custom hook to use auth context
 *
 * This is already implemented for you!
 * Use it in components like: const { user, login, logout } = useAuth();
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
