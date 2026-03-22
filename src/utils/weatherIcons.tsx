import { Cloud, CloudRain, CloudDrizzle, CloudSnow, CloudFog, Sun, CloudSun, Zap, Wind, Moon, CloudMoon } from 'lucide-react';

export function getWeatherIcon(condition: string, size: number = 6) {
  const cond = condition.toLowerCase();
  
  // Convert size number to actual pixel size
  const sizeClass = size === 16 ? 'size-16' : size === 8 ? 'size-8' : size === 5 ? 'size-5' : 'size-6';
  
  // Check if it's nighttime (between 8 PM and 6 AM)
  const hour = new Date().getHours();
  const isNight = hour >= 20 || hour < 6;
  
  // Thunderstorm
  if (cond.includes('thunder') || cond.includes('storm')) {
    return <Zap className={`${sizeClass} text-yellow-500 fill-yellow-500`} />;
  }
  
  // Rain
  if (cond.includes('rain') && !cond.includes('drizzle')) {
    return <CloudRain className={`${sizeClass} text-blue-600`} />;
  }
  
  // Drizzle
  if (cond.includes('drizzle')) {
    return <CloudDrizzle className={`${sizeClass} text-blue-400`} />;
  }
  
  // Snow
  if (cond.includes('snow') || cond.includes('sleet')) {
    return <CloudSnow className={`${sizeClass} text-blue-300`} />;
  }
  
  // Fog/Mist/Haze
  if (cond.includes('fog') || cond.includes('mist') || cond.includes('haze') || cond.includes('smoke')) {
    return <CloudFog className={`${sizeClass} text-gray-400`} />;
  }
  
  // Wind
  if (cond.includes('wind') && !cond.includes('cloudy')) {
    return <Wind className={`${sizeClass} text-gray-500`} />;
  }
  
  // Cloudy/Overcast
  if (cond.includes('cloud') && (cond.includes('overcast') || cond.includes('mostly'))) {
    return <Cloud className={`${sizeClass} text-gray-500`} />;
  }
  
  // Partly cloudy
  if (cond.includes('partly') || cond.includes('few clouds') || cond.includes('scattered')) {
    if (isNight) {
      return <CloudMoon className={`${sizeClass} text-indigo-300`} />;
    }
    return <CloudSun className={`${sizeClass} text-amber-500`} />;
  }
  
  // Any remaining cloudy
  if (cond.includes('cloud')) {
    return <Cloud className={`${sizeClass} text-gray-400`} />;
  }
  
  // Clear/Sunny (default)
  if (isNight) {
    return <Moon className={`${sizeClass} text-indigo-300 fill-indigo-300`} />;
  }
  return <Sun className={`${sizeClass} text-amber-500 fill-amber-500`} />;
}

export function getWeatherEmoji(condition: string): string {
  const cond = condition.toLowerCase();
  
  if (cond.includes('thunder') || cond.includes('storm')) return '⛈️';
  if (cond.includes('rain')) return '🌧️';
  if (cond.includes('drizzle')) return '🌦️';
  if (cond.includes('snow')) return '❄️';
  if (cond.includes('fog') || cond.includes('mist')) return '🌫️';
  if (cond.includes('cloud')) return '☁️';
  
  // Check time of day for sun/moon
  const hour = new Date().getHours();
  if (hour >= 6 && hour < 20) {
    return '☀️'; // Sun during day
  }
  return '🌙'; // Moon at night
}