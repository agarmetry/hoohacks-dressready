import { API_BASE_URL, API_ENDPOINTS } from '../config/api';
import type { Weather, HourlyForecast, DailyForecast, CalendarEvent, Location } from '../app/data/mockData';

// Generic fetch wrapper with error handling
async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API fetch error:', error);
    throw error;
  }
}

// Weather API calls
export const weatherAPI = {
  getCurrentWeather: async (lat: number, lon: number): Promise<Weather> => {
    return fetchAPI<Weather>(
      `${API_ENDPOINTS.weather.current}?lat=${lat}&lon=${lon}`
    );
  },

  getHourlyForecast: async (lat: number, lon: number): Promise<HourlyForecast[]> => {
    return fetchAPI<HourlyForecast[]>(
      `${API_ENDPOINTS.weather.hourly}?lat=${lat}&lon=${lon}`
    );
  },

  getDailyForecast: async (lat: number, lon: number): Promise<DailyForecast[]> => {
    return fetchAPI<DailyForecast[]>(
      `${API_ENDPOINTS.weather.daily}?lat=${lat}&lon=${lon}`
    );
  },
};

// Calendar API calls
export const calendarAPI = {
  getEvents: async (startDate: Date, endDate: Date): Promise<CalendarEvent[]> => {
    const start = startDate.toISOString();
    const end = endDate.toISOString();
    
    return fetchAPI<CalendarEvent[]>(
      `${API_ENDPOINTS.calendar.events}?start=${start}&end=${end}`
    );
  },

  connectGoogleCalendar: async (): Promise<{ authUrl: string }> => {
    return fetchAPI<{ authUrl: string }>(
      API_ENDPOINTS.calendar.connect,
      { method: 'POST' }
    );
  },

  syncCalendar: async (): Promise<{ success: boolean }> => {
    return fetchAPI<{ success: boolean }>(
      API_ENDPOINTS.calendar.sync,
      { method: 'POST' }
    );
  },
};

// User preferences API calls
export const preferencesAPI = {
  getPreferences: async (): Promise<{
    styleVibe: string;
    colorPalette: string;
    priority: string;
  }> => {
    return fetchAPI(API_ENDPOINTS.preferences.get);
  },

  updatePreferences: async (preferences: {
    styleVibe: string;
    colorPalette: string;
    priority: string;
  }): Promise<{ success: boolean }> => {
    return fetchAPI(API_ENDPOINTS.preferences.update, {
      method: 'PUT',
      body: JSON.stringify(preferences),
    });
  },
};

// Location API calls
export const locationAPI = {
  updateLocation: async (location: Location): Promise<{ success: boolean }> => {
    return fetchAPI(API_ENDPOINTS.location.update, {
      method: 'PUT',
      body: JSON.stringify(location),
    });
  },
};