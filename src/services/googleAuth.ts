/**
 * Google OAuth Service using Google Identity Services (GIS)
 * This is a client-side implementation that works without a backend
 */

import { API_CONFIG } from '../config/api';

export interface GoogleAuthUser {
  id: string;
  email: string;
  name: string;
  picture?: string;
  accessToken: string;
}

export interface GoogleAuthState {
  isAuthenticated: boolean;
  user: GoogleAuthUser | null;
}

// Extend Window interface for Google Identity Services
declare global {
  interface Window {
    google?: {
      accounts: {
        oauth2: {
          initTokenClient: (config: {
            client_id: string;
            scope: string;
            callback: (response: { access_token: string; error?: string }) => void;
          }) => {
            requestAccessToken: () => void;
          };
          revoke: (token: string, callback?: () => void) => void;
        };
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential: string }) => void;
          }) => void;
          renderButton: (element: HTMLElement, options: {
            theme?: 'outline' | 'filled_blue' | 'filled_black';
            size?: 'large' | 'medium' | 'small';
            text?: string;
            shape?: 'rectangular' | 'pill' | 'circle' | 'square';
          }) => void;
          prompt: () => void;
        };
      };
    };
  }
}

class GoogleAuthService {
  private readonly STORAGE_KEY = 'dressready_google_auth';
  private tokenClient: any = null;
  private isInitialized = false;

  /**
   * Load Google Identity Services script
   */
  async loadGoogleScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      // Check if already loaded
      if (window.google?.accounts) {
        this.isInitialized = true;
        resolve();
        return;
      }

      // Check if script tag already exists
      if (document.querySelector('script[src*="accounts.google.com"]')) {
        // Wait for it to load
        const checkInterval = setInterval(() => {
          if (window.google?.accounts) {
            clearInterval(checkInterval);
            this.isInitialized = true;
            resolve();
          }
        }, 100);
        
        setTimeout(() => {
          clearInterval(checkInterval);
          reject(new Error('Google script load timeout'));
        }, 10000);
        return;
      }

      // Create and load the script
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        this.isInitialized = true;
        resolve();
      };
      
      script.onerror = () => {
        reject(new Error('Failed to load Google Identity Services'));
      };
      
      document.head.appendChild(script);
    });
  }

  /**
   * Initialize OAuth token client
   */
  async initializeTokenClient(): Promise<void> {
    if (!this.isInitialized) {
      await this.loadGoogleScript();
    }

    if (!window.google?.accounts?.oauth2) {
      throw new Error('Google Identity Services not available');
    }

    if (!API_CONFIG.oauth.clientId) {
      throw new Error('VITE_GOOGLE_CLIENT_ID is not configured');
    }

    return new Promise((resolve) => {
      this.tokenClient = window.google!.accounts.oauth2.initTokenClient({
        client_id: API_CONFIG.oauth.clientId,
        scope: API_CONFIG.oauth.scopes.join(' '),
        callback: async (response: { access_token: string; error?: string }) => {
          if (response.error) {
            console.error('OAuth error:', response.error);
            return;
          }

          // Get user info with the access token
          await this.fetchUserInfo(response.access_token);
        },
      });
      resolve();
    });
  }

  /**
   * Fetch user info from Google API
   */
  private async fetchUserInfo(accessToken: string): Promise<GoogleAuthUser> {
    try {
      const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user info');
      }

      const data = await response.json();
      
      const user: GoogleAuthUser = {
        id: data.id,
        email: data.email,
        name: data.name,
        picture: data.picture,
        accessToken,
      };

      // Store auth data
      this.setAuthData(user);

      return user;
    } catch (error) {
      console.error('Error fetching user info:', error);
      throw new Error('Failed to get user information');
    }
  }

  /**
   * Start Google OAuth login flow
   */
  async login(): Promise<void> {
    try {
      if (!this.tokenClient) {
        await this.initializeTokenClient();
      }

      // Request access token - this will show Google sign-in popup
      this.tokenClient.requestAccessToken();
    } catch (error) {
      console.error('Login error:', error);
      throw new Error('Failed to initiate login');
    }
  }

  /**
   * Get current auth state from storage
   */
  getAuthState(): GoogleAuthState {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (!stored) {
        return { isAuthenticated: false, user: null };
      }

      const user = JSON.parse(stored) as GoogleAuthUser;
      
      // Basic validation
      if (!user.accessToken || !user.email) {
        return { isAuthenticated: false, user: null };
      }

      return { isAuthenticated: true, user };
    } catch (error) {
      console.error('Failed to get auth state:', error);
      return { isAuthenticated: false, user: null };
    }
  }

  /**
   * Store auth data in local storage
   */
  private setAuthData(user: GoogleAuthUser): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(user));
    
    // Dispatch custom event for auth state changes
    window.dispatchEvent(new CustomEvent('authStateChanged', { detail: user }));
  }

  /**
   * Logout and revoke access
   */
  async logout(): Promise<void> {
    const authState = this.getAuthState();
    
    if (authState.user?.accessToken) {
      try {
        // Revoke the access token
        if (window.google?.accounts?.oauth2) {
          window.google.accounts.oauth2.revoke(authState.user.accessToken, () => {
            console.log('Access token revoked');
          });
        }
      } catch (error) {
        console.error('Error revoking token:', error);
      }
    }

    // Clear local storage
    localStorage.removeItem(this.STORAGE_KEY);
    
    // Dispatch custom event
    window.dispatchEvent(new CustomEvent('authStateChanged', { detail: null }));
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return this.getAuthState().isAuthenticated;
  }

  /**
   * Get current user
   */
  getCurrentUser(): GoogleAuthUser | null {
    return this.getAuthState().user;
  }

  /**
   * Get access token for API calls
   */
  getAccessToken(): string | null {
    const user = this.getCurrentUser();
    return user?.accessToken || null;
  }

  /**
   * Validate if access token is still valid
   * In production, you would check token expiry
   */
  async validateToken(): Promise<boolean> {
    const token = this.getAccessToken();
    if (!token) return false;

    try {
      const response = await fetch('https://www.googleapis.com/oauth2/v2/tokeninfo', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.ok;
    } catch {
      return false;
    }
  }
}

// Export singleton instance
export const googleAuthService = new GoogleAuthService();
