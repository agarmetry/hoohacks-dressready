import { useState, useEffect, useCallback } from 'react';
import { googleAuthService, GoogleAuthUser } from '../services/googleAuth';

export interface UseGoogleAuthReturn {
  isAuthenticated: boolean;
  user: GoogleAuthUser | null;
  isLoading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  error: string | null;
}

/**
 * Hook for Google OAuth authentication
 * Uses Google Identity Services for client-side OAuth
 */
export function useGoogleAuth(): UseGoogleAuthReturn {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<GoogleAuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check for existing auth state on mount
  useEffect(() => {
    const checkAuthState = async () => {
      try {
        const authState = googleAuthService.getAuthState();
        setIsAuthenticated(authState.isAuthenticated);
        setUser(authState.user);

        // Validate token if authenticated
        if (authState.isAuthenticated && authState.user) {
          const isValid = await googleAuthService.validateToken();
          if (!isValid) {
            // Token invalid, logout
            await googleAuthService.logout();
            setIsAuthenticated(false);
            setUser(null);
          }
        }
      } catch (err) {
        console.error('Error checking auth state:', err);
        setError('Failed to restore session');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthState();

    // Listen for auth state changes
    const handleAuthStateChange = (event: CustomEvent) => {
      if (event.detail) {
        setIsAuthenticated(true);
        setUser(event.detail);
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    };

    window.addEventListener('authStateChanged', handleAuthStateChange as EventListener);

    return () => {
      window.removeEventListener('authStateChanged', handleAuthStateChange as EventListener);
    };
  }, []);

  // Login handler
  const login = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      await googleAuthService.login();
      
      // Auth state will be updated via the authStateChanged event
    } catch (err) {
      console.error('Login error:', err);
      setError('Failed to start login. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Logout handler
  const logout = useCallback(async () => {
    try {
      setError(null);
      await googleAuthService.logout();
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
