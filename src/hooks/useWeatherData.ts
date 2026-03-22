import { useState, useEffect } from 'react';
import { weatherAPI } from '../services/api';
import { fetchOpenWeatherData } from '../services/openWeatherAPI';
import { mockWeather, getHourlyForecast, getDailyForecast } from '../app/data/mockData';
import type { Weather, HourlyForecast, DailyForecast } from '../app/data/mockData';

interface WeatherState {
  current: Weather | null;
  hourly: HourlyForecast[];
  daily: DailyForecast[];
  loading: boolean;
  error: string | null;
}

export function useWeatherData(lat: number, lon: number, useMockData = false) {
  const [state, setState] = useState<WeatherState>({
    current: null,
    hourly: [],
    daily: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchWeatherData = async () => {
      // Use mock data for development/demo
      if (useMockData) {
        setState({
          current: mockWeather,
          hourly: getHourlyForecast(),
          daily: getDailyForecast(),
          loading: false,
          error: null,
        });
        return;
      }

      // Fetch real data from OpenWeather API
      setState(prev => ({ ...prev, loading: true, error: null }));

      try {
        const { current, hourly, daily } = await fetchOpenWeatherData(lat, lon);

        setState({
          current,
          hourly,
          daily,
          loading: false,
          error: null,
        });
      } catch (error) {
        console.error('Failed to fetch weather data:', error);
        
        // Fallback to mock data on error
        setState({
          current: mockWeather,
          hourly: getHourlyForecast(),
          daily: getDailyForecast(),
          loading: false,
          error: 'Using demo data. Check API connection.',
        });
      }
    };

    fetchWeatherData();
  }, [lat, lon, useMockData]);

  return state;
}