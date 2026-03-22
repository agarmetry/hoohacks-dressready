import type { Weather, HourlyForecast, DailyForecast } from '../app/data/mockData';

const OPENWEATHER_API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY || '';
const OPENWEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5';

interface CurrentWeatherResponse {
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    humidity: number;
  };
  weather: Array<{
    id: number;
    main: string;
    description: string;
    icon: string;
  }>;
  wind: {
    speed: number;
  };
  dt: number;
}

interface ForecastResponse {
  list: Array<{
    dt: number;
    main: {
      temp: number;
      temp_min: number;
      temp_max: number;
    };
    weather: Array<{
      id: number;
      main: string;
      description: string;
      icon: string;
    }>;
    wind: {
      speed: number;
    };
    pop: number; // Probability of precipitation
    dt_txt: string;
  }>;
}

// Map OpenWeather condition codes to our app's weather conditions
function mapWeatherCondition(weatherCode: number, description: string): string {
  if (weatherCode >= 200 && weatherCode < 300) return 'Thunderstorm';
  if (weatherCode >= 300 && weatherCode < 400) return 'Drizzle';
  if (weatherCode >= 500 && weatherCode < 600) return 'Rain';
  if (weatherCode >= 600 && weatherCode < 700) return 'Snow';
  if (weatherCode >= 700 && weatherCode < 800) return 'Fog';
  if (weatherCode === 800) return 'Clear';
  if (weatherCode > 800) return 'Cloudy';
  return description;
}

// Fetch weather data from OpenWeather API
export async function fetchOpenWeatherData(lat: number, lon: number): Promise<{
  current: Weather;
  hourly: HourlyForecast[];
  daily: DailyForecast[];
}> {
  try {
    if (!OPENWEATHER_API_KEY) {
      throw new Error('VITE_OPENWEATHER_API_KEY is not configured');
    }

    // Fetch current weather
    const currentUrl = `${OPENWEATHER_BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=imperial`;
    const currentResponse = await fetch(currentUrl);
    if (!currentResponse.ok) {
      throw new Error(`OpenWeather API Error: ${currentResponse.status} ${currentResponse.statusText}`);
    }
    const currentData: CurrentWeatherResponse = await currentResponse.json();
    
    // Transform current weather
    const current: Weather = {
      temp: Math.round(currentData.main.temp),
      condition: mapWeatherCondition(currentData.weather[0].id, currentData.weather[0].main),
      description: currentData.weather[0].description,
      feelsLike: Math.round(currentData.main.feels_like),
      tempMax: Math.round(currentData.main.temp_max),
      tempMin: Math.round(currentData.main.temp_min),
      humidity: currentData.main.humidity,
      windSpeed: Math.round(currentData.wind.speed),
      aqiLabel: 'Good', // AQI requires separate API call
    };
    
    // Fetch forecast data
    const forecastUrl = `${OPENWEATHER_BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=imperial`;
    const forecastResponse = await fetch(forecastUrl);
    if (!forecastResponse.ok) {
      throw new Error(`OpenWeather API Error: ${forecastResponse.status} ${forecastResponse.statusText}`);
    }
    const forecastData: ForecastResponse = await forecastResponse.json();
    
    // Transform hourly forecast (3-hour intervals for up to 40 data points = 5 days)
    const hourly: HourlyForecast[] = forecastData.list.map((item) => {
      const date = new Date(item.dt * 1000);
      return {
        time: date.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true }),
        hour: date.getHours(),
        temperature: Math.round(item.main.temp),
        condition: mapWeatherCondition(item.weather[0].id, item.weather[0].main),
        precipitationChance: Math.round(item.pop * 100),
        windSpeed: Math.round(item.wind.speed),
      };
    });
    
    // Aggregate daily forecast from 3-hour data
    const dailyMap = new Map<string, {
      date: Date;
      temps: number[];
      conditions: string[];
      precipChances: number[];
    }>();
    
    forecastData.list.forEach((item) => {
      const date = new Date(item.dt * 1000);
      const dayKey = date.toDateString();
      
      if (!dailyMap.has(dayKey)) {
        dailyMap.set(dayKey, {
          date: date,
          temps: [],
          conditions: [],
          precipChances: [],
        });
      }
      
      const dayData = dailyMap.get(dayKey)!;
      dayData.temps.push(item.main.temp);
      dayData.conditions.push(mapWeatherCondition(item.weather[0].id, item.weather[0].main));
      dayData.precipChances.push(item.pop * 100);
    });
    
    // Convert map to daily forecast array
    const daily: DailyForecast[] = Array.from(dailyMap.values()).slice(0, 8).map((dayData) => {
      const maxTemp = Math.max(...dayData.temps);
      const minTemp = Math.min(...dayData.temps);
      const avgPrecip = dayData.precipChances.reduce((a, b) => a + b, 0) / dayData.precipChances.length;
      
      // Get most common condition
      const conditionCounts = dayData.conditions.reduce((acc, cond) => {
        acc[cond] = (acc[cond] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      const mostCommonCondition = Object.entries(conditionCounts).sort((a, b) => b[1] - a[1])[0][0];
      
      return {
        date: dayData.date,
        high: Math.round(maxTemp),
        low: Math.round(minTemp),
        condition: mostCommonCondition,
        precipitationChance: Math.round(avgPrecip),
      };
    });
    
    return { current, hourly, daily };
  } catch (error) {
    console.error('Failed to fetch OpenWeather data:', error);
    throw error;
  }
}
