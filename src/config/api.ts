// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

// Google OAuth Configuration
export const GOOGLE_OAUTH_CONFIG = {
  clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID || '',
  scopes: [
    'https://www.googleapis.com/auth/calendar.readonly',
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile',
  ],
};

export const API_CONFIG = {
  baseURL: API_BASE_URL,
  oauth: GOOGLE_OAUTH_CONFIG,
};

export const API_ENDPOINTS = {
  // Weather endpoints
  weather: {
    current: '/api/weather/current',
    hourly: '/api/weather/hourly',
    daily: '/api/weather/daily',
  },
  
  // Calendar endpoints
  calendar: {
    events: '/api/calendar/events',
    connect: '/api/calendar/connect',
    sync: '/api/calendar/sync',
  },
  
  // User preferences
  preferences: {
    get: '/api/preferences',
    update: '/api/preferences',
  },
  
  // Location
  location: {
    update: '/api/location',
  },
};
