// Mock data for DressReady - replacing AI and API calls with realistic demo data

export interface DressCode {
  name: string;
  bgColor: string;
  textColor: string;
}

export const DRESS_CODES: Record<string, DressCode> = {
  'Casual': { name: 'Casual', bgColor: '#E1F5EE', textColor: '#085041' },
  'Smart Casual': { name: 'Smart Casual', bgColor: '#EEEDFE', textColor: '#3C3489' },
  'Business Casual': { name: 'Business Casual', bgColor: '#FAEEDA', textColor: '#633806' },
  'Business': { name: 'Business', bgColor: '#E6F1FB', textColor: '#0C447C' },
  'Formal': { name: 'Formal', bgColor: '#FCEBEB', textColor: '#791F1F' },
  'Athletic': { name: 'Athletic', bgColor: '#EAF3DE', textColor: '#27500A' },
};

export const DRESS_CODE_ORDER = ['Casual', 'Smart Casual', 'Business Casual', 'Business', 'Formal', 'Athletic'];

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  location: string;
  description: string;
  isVirtual: boolean;
  calendarName: string;
  dressCode: string;
  eventType: string;
  recommendation: string;
  forecastSummary: string;
  resolvedLocationLabel: string;
}

export interface Weather {
  temp: number;
  feelsLike: number;
  condition: string;
  description: string;
  tempMax: number;
  tempMin: number;
  humidity: number;
  windSpeed: number;
  aqiLabel?: string;
}

export interface HourlyForecast {
  time: string;
  hour: number;
  temperature: number;
  condition: string;
  precipitationChance: number;
  windSpeed: number;
}

export interface DailyForecast {
  date: Date;
  high: number;
  low: number;
  condition: string;
  precipitationChance: number;
}

export interface Location {
  label: string;
  lat: number;
  lon: number;
  source: string;
}

// Mock weather data
export const mockWeather: Weather = {
  temp: 72,
  feelsLike: 68,
  condition: 'Partly Cloudy',
  description: 'partly cloudy',
  tempMax: 78,
  tempMin: 65,
  humidity: 62,
  windSpeed: 8,
  aqiLabel: 'Good',
};

export const mockLocation: Location = {
  label: 'Charlottesville, VA',
  lat: 38.0293,
  lon: -78.4767,
  source: 'ip',
};

// Mock calendar events with realistic data
export function getMockEvents(date: Date): CalendarEvent[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const targetDate = new Date(date);
  targetDate.setHours(0, 0, 0, 0);
  
  const dayOffset = Math.floor((targetDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  
  // Today's events
  if (dayOffset === 0) {
    return [
      {
        id: '1',
        title: 'Morning Yoga Class',
        start: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 7, 0),
        end: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 8, 0),
        location: 'Core Power Yoga, Charlottesville, VA',
        description: '',
        isVirtual: false,
        calendarName: 'Personal',
        dressCode: 'Athletic',
        eventType: 'Workout',
        recommendation: 'Wear moisture-wicking athletic wear and bring layers for the walk to the studio. Light jacket recommended for the morning commute.',
        forecastSummary: '65°F, partly cloudy',
        resolvedLocationLabel: 'Charlottesville, VA',
      },
      {
        id: '2',
        title: 'Product Design Team Sync',
        start: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 10, 0),
        end: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 11, 0),
        location: '',
        description: 'Weekly sync - zoom.us/j/123456',
        isVirtual: true,
        calendarName: 'Work',
        dressCode: 'Smart Casual',
        eventType: 'Meeting',
        recommendation: 'Smart casual from the waist up for video. Try a button-down or polo with a blazer. No need to worry about weather since you\'re working from home.',
        forecastSummary: '72°F, partly cloudy',
        resolvedLocationLabel: '',
      },
      {
        id: '3',
        title: 'Coffee with Sarah',
        start: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 14, 30),
        end: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 15, 30),
        location: 'Shenandoah Joe, Belmont',
        description: '',
        isVirtual: false,
        calendarName: 'Personal',
        dressCode: 'Casual',
        eventType: 'Social',
        recommendation: 'Go casual and comfortable - jeans and a sweater work great. The afternoon will be pleasant, so no heavy layers needed.',
        forecastSummary: '75°F, sunny',
        resolvedLocationLabel: 'Charlottesville, VA',
      },
      {
        id: '4',
        title: 'Client Presentation',
        start: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 16, 0),
        end: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 17, 30),
        location: 'Downtown Office, 5th Street',
        description: 'Q1 results presentation',
        isVirtual: false,
        calendarName: 'Work',
        dressCode: 'Business',
        eventType: 'Presentation',
        recommendation: 'Dress in business attire - suit and tie recommended. Temperature will be mild, so you can skip the overcoat.',
        forecastSummary: '73°F, partly cloudy',
        resolvedLocationLabel: 'Charlottesville, VA',
      },
    ];
  }
  
  // Tomorrow's events
  if (dayOffset === 1) {
    return [
      {
        id: '5',
        title: 'Team Standup',
        start: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, 9, 0),
        end: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, 9, 30),
        location: '',
        description: 'Daily standup via Zoom',
        isVirtual: true,
        calendarName: 'Work',
        dressCode: 'Casual',
        eventType: 'Meeting',
        recommendation: 'Casual top for video call - t-shirt or casual button-down works. Stay comfortable at home.',
        forecastSummary: '70°F, cloudy',
        resolvedLocationLabel: '',
      },
      {
        id: '6',
        title: 'Lunch with Investors',
        start: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, 12, 30),
        end: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, 14, 0),
        location: 'The Ivy, Charlottesville',
        description: '',
        isVirtual: false,
        calendarName: 'Work',
        dressCode: 'Business Casual',
        eventType: 'Meeting',
        recommendation: 'Business casual with a polished look - dress pants and a collared shirt. Light jacket recommended as temperatures will be cooler.',
        forecastSummary: '68°F, cloudy',
        resolvedLocationLabel: 'Charlottesville, VA',
      },
    ];
  }
  
  // Day after tomorrow
  if (dayOffset === 2) {
    return [
      {
        id: '7',
        title: 'UX Research Interview',
        start: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2, 11, 0),
        end: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2, 12, 0),
        location: 'User Testing Lab, Main Street',
        description: '',
        isVirtual: false,
        calendarName: 'Work',
        dressCode: 'Smart Casual',
        eventType: 'Research',
        recommendation: 'Smart casual to appear professional yet approachable. Opt for chinos and a button-down. Weather will be comfortable.',
        forecastSummary: '74°F, sunny',
        resolvedLocationLabel: 'Charlottesville, VA',
      },
    ];
  }
  
  // Return empty for other days
  return [];
}

// Mock outfit recommendations based on dress code + weather
export function getOutfitRecommendation(
  dressCode: string,
  weather: Weather,
  isVirtual: boolean,
  exposureLevel: string = 'medium'
): string {
  const temp = weather.temp;
  const condition = weather.condition.toLowerCase();
  const isRaining = condition.includes('rain');
  const isCold = temp < 50;
  const isHot = temp > 80;
  
  const virtualNote = isVirtual ? 'This is a virtual meeting - dress code applies from the waist up first. ' : '';
  
  let baseRec = '';
  
  switch (dressCode) {
    case 'Athletic':
      baseRec = 'Wear moisture-wicking athletic wear and comfortable sneakers.';
      break;
    case 'Casual':
      baseRec = isVirtual 
        ? 'Casual top for video - t-shirt or casual button-down works.'
        : 'Go casual and comfortable - jeans and a sweater work great.';
      break;
    case 'Smart Casual':
      baseRec = 'Smart casual to appear professional yet approachable. Opt for chinos and a button-down.';
      break;
    case 'Business Casual':
      baseRec = 'Business casual with a polished look - dress pants and a collared shirt.';
      break;
    case 'Business':
      baseRec = 'Dress in business attire - suit and tie recommended.';
      break;
    case 'Formal':
      baseRec = 'Formal attire required - full suit, dress shoes, and accessories.';
      break;
    default:
      baseRec = 'Dress appropriately for the occasion.';
  }
  
  let weatherNote = '';
  
  if (exposureLevel === 'low' && isVirtual) {
    weatherNote = 'Stay comfortable at home.';
  } else if (exposureLevel === 'low') {
    weatherNote = 'Commute weather only matters lightly today.';
  } else {
    if (isRaining) {
      weatherNote = 'Bring a waterproof jacket or umbrella for the rain.';
    } else if (isCold) {
      weatherNote = 'Layer up with a warm coat - temperatures are chilly.';
    } else if (isHot) {
      weatherNote = 'It\'s hot outside - opt for lighter fabrics.';
    } else if (temp < 65) {
      weatherNote = 'Light jacket recommended for cooler temperatures.';
    } else {
      weatherNote = 'Weather will be comfortable.';
    }
  }
  
  return `${virtualNote}${baseRec} ${weatherNote}`.trim();
}

// Get the emoji for weather condition
export function getWeatherEmoji(weather: Weather): string {
  const condition = weather.condition.toLowerCase();
  const temp = weather.temp;
  
  if (condition.includes('thunder') || condition.includes('storm')) return '⛈';
  if (condition.includes('snow')) return '🌨';
  if (condition.includes('rain')) {
    return weather.windSpeed > 20 ? '🌧' : '🌦';
  }
  if (temp >= 85) return '☀';
  if (temp >= 65) return '⛅';
  if (temp >= 45) return '☁';
  if (temp >= 32) return '🌥';
  if (temp < 32) return '❄';
  
  return '☁';
}

// Generate hourly forecast data
export function getHourlyForecast(): HourlyForecast[] {
  const now = new Date();
  const currentHour = now.getHours();
  
  // Generate 8 days * 24 hours = 192 hours of data
  return Array.from({ length: 192 }, (_, i) => {
    const hour = (currentHour + i) % 24;
    const dayOffset = Math.floor(i / 24);
    
    // Create realistic temperature variation
    // Base temperature for the day (varies day to day)
    const dayTemp = 68 + Math.sin(dayOffset * 0.5) * 6;
    
    // Hourly variation - peaks at 3 PM (15), lowest at 3 AM (3)
    const hourAngle = ((hour - 3) / 24) * Math.PI * 2;
    const hourlyVariation = Math.sin(hourAngle) * 15;
    
    // Calculate final temperature
    const temp = dayTemp + hourlyVariation;
    
    // Precipitation varies by time
    const precipChance = hour >= 14 && hour <= 18 
      ? Math.round(10 + Math.random() * 50)  // Higher chance afternoon
      : Math.round(Math.random() * 25);       // Lower chance other times
    
    // Wind speed varies
    const windSpeed = Math.round(3 + Math.random() * 12);
    
    return {
      time: hour === 0 ? '12 AM' : hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour - 12} PM`,
      hour,
      temperature: Math.round(temp),
      condition: hour >= 6 && hour <= 18 
        ? (precipChance > 30 ? 'Partly Cloudy' : 'Sunny')
        : (precipChance > 20 ? 'Cloudy' : 'Clear'),
      precipitationChance: precipChance,
      windSpeed: windSpeed,
    };
  });
}

// Generate daily forecast data (8 days)
export function getDailyForecast(): DailyForecast[] {
  const today = new Date();
  
  return Array.from({ length: 8 }, (_, i) => {
    const date = new Date(today);
    date.setDate(date.getDate() + i);
    
    const baseTemp = 70 + Math.sin(i / 2) * 10;
    const high = Math.round(baseTemp + 5 + Math.random() * 5);
    const low = Math.round(baseTemp - 5 - Math.random() * 5);
    
    const conditions = ['Sunny', 'Partly Cloudy', 'Cloudy', 'Light Rain', 'Clear'];
    const condition = conditions[i % conditions.length];
    
    return {
      date,
      high,
      low,
      condition,
      precipitationChance: condition.includes('Rain') ? Math.round(60 + Math.random() * 30) : Math.round(Math.random() * 20),
    };
  });
}