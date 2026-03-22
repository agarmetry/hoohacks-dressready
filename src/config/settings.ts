/**
 * Application Settings
 * Configure various features and data sources
 */

export const APP_SETTINGS = {
  // Weather Data Source
  USE_MOCK_WEATHER: false, // Set to false to use OpenWeather API
  
  // Calendar Data Source
  USE_MOCK_CALENDAR: false, // Set to false to use Google Calendar API
  
  // Authentication Mode
  DEMO_MODE: true, // Set to true to skip OAuth and use demo account
  
  // OpenWeather API Configuration
  OPENWEATHER_API_KEY: import.meta.env.VITE_OPENWEATHER_API_KEY || '',
  
  // Notification Settings
  DEFAULT_NOTIFICATION_LEAD_TIME: 30, // minutes before event
  
  // UI Settings
  ENABLE_ANIMATIONS: true,
  THEME: 'light',
} as const;

// Demo user (used when DEMO_MODE is true)
export const DEMO_USER = {
  id: 'demo-user-123',
  email: 'demo@dressready.app',
  name: 'Demo User',
  picture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Demo',
  accessToken: 'demo-token-not-real',
};

export type AppSettings = typeof APP_SETTINGS;
