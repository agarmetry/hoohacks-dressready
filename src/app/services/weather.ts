// Weather service with current, hourly, and daily forecast
export interface WeatherCondition {
  temperature: number;
  condition: {
    text: string;
    icon: string;
  };
  precipitation?: number;
  humidity?: number;
  wind?: number;
  feelsLike?: number;
  high?: number;
  low?: number;
}

export interface HourlyForecast {
  time: string;
  hour: number;
  temperature: number;
  condition: string;
  icon: string;
  precipitationChance?: number;
}

export interface DailyForecast {
  day: string;
  date: Date;
  high: number;
  low: number;
  condition: string;
  icon: string;
  precipitationChance?: number;
}

export interface WeatherData {
  location: string;
  current: WeatherCondition;
  hourly: HourlyForecast[];
  daily: DailyForecast[];
}

// Map weather conditions to icons
export function getWeatherIcon(condition: string): string {
  const cond = condition.toLowerCase();
  if (cond.includes('clear') || cond.includes('sunny')) return 'sun';
  if (cond.includes('partly cloudy') || cond.includes('partly')) return 'cloud-sun';
  if (cond.includes('cloudy') || cond.includes('overcast')) return 'cloud';
  if (cond.includes('rain') || cond.includes('drizzle')) return 'cloud-rain';
  if (cond.includes('thunderstorm') || cond.includes('storm')) return 'cloud-lightning';
  if (cond.includes('snow')) return 'snowflake';
  if (cond.includes('fog') || cond.includes('mist')) return 'cloud-fog';
  if (cond.includes('wind')) return 'wind';
  return 'cloud';
}

// Mock weather service - in production this would call a real API
export async function getCurrentWeather(location: string = 'Charlottesville, VA, United States'): Promise<WeatherData> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));

  const now = new Date();
  const currentHour = now.getHours();

  // Generate realistic hourly forecast for the next 24 hours
  const hourly: HourlyForecast[] = [];
  const baseTemp = 74;
  
  for (let i = 0; i < 24; i++) {
    const hour = (currentHour + i) % 24;
    const hourDate = new Date(now.getTime() + i * 60 * 60 * 1000);
    
    // Temperature varies throughout the day
    let temp = baseTemp;
    if (hour >= 0 && hour < 6) temp = baseTemp - 20; // Night
    else if (hour >= 6 && hour < 12) temp = baseTemp - 10 + (hour - 6) * 2; // Morning
    else if (hour >= 12 && hour < 18) temp = baseTemp - 2; // Afternoon
    else temp = baseTemp - 5 - (hour - 18) * 2; // Evening
    
    let condition = 'Clear Sky';
    let icon = 'sun';
    
    if (hour >= 0 && hour < 6 || hour >= 20) {
      condition = 'Clear';
      icon = 'moon';
    } else if (hour >= 6 && hour < 10) {
      condition = 'Partly Cloudy';
      icon = 'cloud-sun';
    } else if (hour >= 10 && hour < 16) {
      condition = 'Clear Sky';
      icon = 'sun';
    } else {
      condition = 'Partly Cloudy';
      icon = 'cloud-sun';
    }
    
    hourly.push({
      time: hour === 0 ? '12 AM' : hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour - 12} PM`,
      hour,
      temperature: Math.round(temp),
      condition,
      icon: getWeatherIcon(condition),
      precipitationChance: i % 3 === 0 ? 10 : 0
    });
  }

  // Generate 8-day forecast
  const daily: DailyForecast[] = [];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const conditions = [
    { condition: 'Clear Sky', high: 74, low: 50 },
    { condition: 'Sunny', high: 66, low: 50 },
    { condition: 'Partly Cloudy', high: 66, low: 53 },
    { condition: 'Sunny', high: 70, low: 55 },
    { condition: 'Sunny', high: 71, low: 55 },
    { condition: 'Partly Cloudy', high: 68, low: 55 },
    { condition: 'Partly Cloudy', high: 70, low: 55 },
    { condition: 'Cloudy', high: 73, low: 57 }
  ];

  for (let i = 0; i < 8; i++) {
    const date = new Date(now);
    date.setDate(date.getDate() + i);
    const dayIndex = date.getDay();
    const dayCondition = conditions[i] || conditions[0];
    
    daily.push({
      day: i === 0 ? 'Today' : dayNames[dayIndex],
      date,
      high: dayCondition.high,
      low: dayCondition.low,
      condition: dayCondition.condition,
      icon: getWeatherIcon(dayCondition.condition),
      precipitationChance: i % 3 === 0 ? 10 : 0
    });
  }

  return {
    location,
    current: {
      temperature: 74,
      condition: {
        text: 'Clear Sky',
        icon: getWeatherIcon('Clear Sky')
      },
      precipitation: 10,
      humidity: 62,
      wind: 9,
      feelsLike: 73,
      high: 74,
      low: 50
    },
    hourly,
    daily
  };
}

// Get weather for a specific time and location
export async function getWeatherForTime(
  location: string,
  dateTime: Date
): Promise<WeatherCondition> {
  const weatherData = await getCurrentWeather(location);
  
  // Find the closest hourly forecast
  const targetHour = dateTime.getHours();
  const closest = weatherData.hourly.find(h => h.hour === targetHour) || weatherData.hourly[0];
  
  return {
    temperature: closest.temperature,
    condition: {
      text: closest.condition,
      icon: closest.icon
    },
    feelsLike: closest.temperature - 1
  };
}

// Synchronous mock weather data for immediate use
export const mockWeatherData: WeatherData = (() => {
  const now = new Date();
  const currentHour = now.getHours();

  // Generate realistic hourly forecast for the next 24 hours
  const hourly: HourlyForecast[] = [];
  const baseTemp = 74;
  
  for (let i = 0; i < 24; i++) {
    const hour = (currentHour + i) % 24;
    
    // Temperature varies throughout the day
    let temp = baseTemp;
    if (hour >= 0 && hour < 6) temp = baseTemp - 20; // Night
    else if (hour >= 6 && hour < 12) temp = baseTemp - 10 + (hour - 6) * 2; // Morning
    else if (hour >= 12 && hour < 18) temp = baseTemp - 2; // Afternoon
    else temp = baseTemp - 5 - (hour - 18) * 2; // Evening
    
    let condition = 'Clear Sky';
    let icon = 'sun';
    
    if (hour >= 0 && hour < 6 || hour >= 20) {
      condition = 'Clear';
      icon = 'moon';
    } else if (hour >= 6 && hour < 10) {
      condition = 'Partly Cloudy';
      icon = 'cloud-sun';
    } else if (hour >= 10 && hour < 16) {
      condition = 'Clear Sky';
      icon = 'sun';
    } else {
      condition = 'Partly Cloudy';
      icon = 'cloud-sun';
    }
    
    hourly.push({
      time: hour === 0 ? '12 AM' : hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour - 12} PM`,
      hour,
      temperature: Math.round(temp),
      condition,
      icon: getWeatherIcon(condition),
      precipitationChance: i % 3 === 0 ? 10 : 0
    });
  }

  // Generate 8-day forecast
  const daily: DailyForecast[] = [];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const conditions = [
    { condition: 'Clear Sky', high: 74, low: 50 },
    { condition: 'Sunny', high: 66, low: 50 },
    { condition: 'Partly Cloudy', high: 66, low: 53 },
    { condition: 'Sunny', high: 70, low: 55 },
    { condition: 'Sunny', high: 71, low: 55 },
    { condition: 'Partly Cloudy', high: 68, low: 55 },
    { condition: 'Partly Cloudy', high: 70, low: 55 },
    { condition: 'Cloudy', high: 73, low: 57 }
  ];

  for (let i = 0; i < 8; i++) {
    const date = new Date(now);
    date.setDate(date.getDate() + i);
    const dayIndex = date.getDay();
    const dayCondition = conditions[i] || conditions[0];
    
    daily.push({
      day: i === 0 ? 'Today' : dayNames[dayIndex],
      date,
      high: dayCondition.high,
      low: dayCondition.low,
      condition: dayCondition.condition,
      icon: getWeatherIcon(dayCondition.condition),
      precipitationChance: i % 3 === 0 ? 10 : 0
    });
  }

  return {
    location: 'Charlottesville, VA',
    current: {
      temperature: 74,
      condition: {
        text: 'Clear Sky',
        icon: getWeatherIcon('Clear Sky')
      },
      precipitation: 10,
      humidity: 62,
      wind: 9,
      feelsLike: 73,
      high: 74,
      low: 50
    },
    hourly,
    daily
  };
})();