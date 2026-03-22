/**
 * Authentication Service for Google OAuth
 * 
 * This service handles Google Calendar OAuth authentication flow.
 * In production, this will be integrated with your Python backend.
 */

import { API_CONFIG } from '../config/api';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  picture?: string;
  accessToken: string;
  refreshToken?: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: AuthUser | null;
}

class AuthService {
  private readonly STORAGE_KEY = 'dressready_auth';

  /**
   * Initialize Google OAuth flow
   * In production, this redirects to your backend's OAuth endpoint
   */
  async initiateGoogleLogin(): Promise<void> {
    try {
      // In production, redirect to backend OAuth endpoint
      const authUrl = `${API_CONFIG.baseURL}/auth/google/login`;
      
      // Store the current URL to return to after OAuth
      sessionStorage.setItem('auth_redirect', window.location.href);
      
      // Redirect to backend OAuth flow
      window.location.href = authUrl;
    } catch (error) {
      console.error('Failed to initiate Google login:', error);
      throw new Error('Failed to start authentication');
    }
  }

  /**
   * Handle OAuth callback
   * Called when user returns from Google OAuth
   */
  async handleOAuthCallback(code: string): Promise<AuthUser> {
    try {
      const response = await fetch(`${API_CONFIG.baseURL}/auth/google/callback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      });

      if (!response.ok) {
        throw new Error('OAuth callback failed');
      }

      const data = await response.json();
      const user: AuthUser = {
        id: data.user.id,
        email: data.user.email,
        name: data.user.name,
        picture: data.user.picture,
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
      };

      // Store auth data
      this.setAuthData(user);

      return user;
    } catch (error) {
      console.error('OAuth callback error:', error);
      throw new Error('Authentication failed');
    }
  }

  /**
   * Get current auth state from storage
   */
  getAuthState(): AuthState {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (!stored) {
        return { isAuthenticated: false, user: null };
      }

      const user = JSON.parse(stored) as AuthUser;
      return { isAuthenticated: true, user };
    } catch (error) {
      console.error('Failed to get auth state:', error);
      return { isAuthenticated: false, user: null };
    }
  }

  /**
   * Store auth data in local storage
   */
  private setAuthData(user: AuthUser): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(user));
  }

  /**
   * Clear auth data and log out
   */
  async logout(): Promise<void> {
    try {
      // Call backend logout endpoint
      const authState = this.getAuthState();
      if (authState.user?.accessToken) {
        await fetch(`${API_CONFIG.baseURL}/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${authState.user.accessToken}`,
            'Content-Type': 'application/json',
          },
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Always clear local storage
      localStorage.removeItem(this.STORAGE_KEY);
    }
  }

  /**
   * Refresh access token using refresh token
   */
  async refreshAccessToken(): Promise<string> {
    const authState = this.getAuthState();
    if (!authState.user?.refreshToken) {
      throw new Error('No refresh token available');
    }

    try {
      const response = await fetch(`${API_CONFIG.baseURL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          refresh_token: authState.user.refreshToken,
        }),
      });

      if (!response.ok) {
        throw new Error('Token refresh failed');
      }

      const data = await response.json();
      
      // Update stored access token
      const updatedUser = {
        ...authState.user,
        accessToken: data.access_token,
      };
      this.setAuthData(updatedUser);

      return data.access_token;
    } catch (error) {
      console.error('Token refresh error:', error);
      // If refresh fails, log out user
      await this.logout();
      throw new Error('Session expired. Please log in again.');
    }
  }

  /**
   * Get current access token
   * Automatically refreshes if expired (in production)
   */
  async getAccessToken(): Promise<string | null> {
    const authState = this.getAuthState();
    if (!authState.user) {
      return null;
    }

    // In production, you would check token expiry and refresh if needed
    // For now, return the stored token
    return authState.user.accessToken;
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return this.getAuthState().isAuthenticated;
  }

  /**
   * Get current user info
   */
  getCurrentUser(): AuthUser | null {
    return this.getAuthState().user;
  }
}

// Export singleton instance
export const authService = new AuthService();

/**
 * PRODUCTION IMPLEMENTATION NOTES:
 * 
 * 1. Backend OAuth Endpoints Needed:
 *    - GET  /auth/google/login - Redirects to Google OAuth
 *    - POST /auth/google/callback - Handles OAuth callback
 *    - POST /auth/refresh - Refreshes access token
 *    - POST /auth/logout - Logs out user
 * 
 * 2. Google OAuth Scopes Required:
 *    - https://www.googleapis.com/auth/calendar.readonly
 *    - https://www.googleapis.com/auth/userinfo.email
 *    - https://www.googleapis.com/auth/userinfo.profile
 * 
 * 3. Environment Variables (Backend):
 *    - GOOGLE_OAUTH_CLIENT_ID
 *    - GOOGLE_OAUTH_CLIENT_SECRET
 *    - GOOGLE_OAUTH_REDIRECT_URI
 * 
 * 4. Security Considerations:
 *    - Always use HTTPS in production
 *    - Implement CSRF protection
 *    - Use secure, httpOnly cookies for refresh tokens (recommended)
 *    - Validate OAuth state parameter
 *    - Set proper CORS headers
 * 
 * 5. Token Management:
 *    - Access tokens should expire after 1 hour
 *    - Refresh tokens can be long-lived
 *    - Implement token rotation for security
 */
