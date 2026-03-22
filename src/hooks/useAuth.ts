import { useState, useEffect, useCallback } from 'react';
import { authService, AuthUser } from '../services/auth';

export interface UseAuthReturn {
  isAuthenticated: boolean;
  user: AuthUser | null;
  isLoading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  error: string | null;
}

/**
 * Custom hook for managing authentication state
 * 
 * Usage:
 * const { isAuthenticated, user, login, logout } = useAuth();
 */
export function useAuth(): UseAuthReturn {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check for existing auth state on mount
  useEffect(() => {
    const checkAuthState = () => {
      try {
        const authState = authService.getAuthState();
        setIsAuthenticated(authState.isAuthenticated);
        setUser(authState.user);
      } catch (err) {
        console.error('Error checking auth state:', err);
        setError('Failed to restore session');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthState();

    // Check for OAuth callback
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    
    if (code) {
      handleOAuthCallback(code);
    }
  }, []);

  // Handle OAuth callback
  const handleOAuthCallback = async (code: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const user = await authService.handleOAuthCallback(code);
      setIsAuthenticated(true);
      setUser(user);

      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
      
      // Redirect to stored location or home
      const redirect = sessionStorage.getItem('auth_redirect');
      if (redirect) {
        sessionStorage.removeItem('auth_redirect');
        window.location.href = redirect;
      }
    } catch (err) {
      console.error('OAuth callback error:', err);
      setError('Authentication failed. Please try again.');
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Login handler
  const login = useCallback(async () => {
    try {
      setError(null);
      await authService.initiateGoogleLogin();
      // User will be redirected to Google OAuth
    } catch (err) {
      console.error('Login error:', err);
      setError('Failed to start login. Please try again.');
    }
  }, []);

  // Logout handler
  const logout = useCallback(async () => {
    try {
      setError(null);
      await authService.logout();
      setIsAuthenticated(false);
      setUser(null);
    } catch (err) {
      console.error('Logout error:', err);
      setError('Logout failed. Please try again.');
    }
  }, []);

  return {
    isAuthenticated,
    user,
    isLoading,
    login,
    logout,
    error,
  };
}
