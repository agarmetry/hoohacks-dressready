import { getWeatherIcon } from '../../utils/weatherIcons';
import type { Weather, Location } from '../data/mockData';

interface WeatherHeaderCardProps {
  weather: Weather;
  location: Location;
}

export function WeatherHeaderCard({ weather, location }: WeatherHeaderCardProps) {
  const detailBits = [
    `H:${weather.tempMax}°`,
    `L:${weather.tempMin}°`,
    `Feels like ${weather.feelsLike}°`,
  ];
  
  if (weather.aqiLabel) {
    detailBits.push(`AQI: ${weather.aqiLabel}`);
  }

  return (
    <div className="bg-white/92 backdrop-blur-sm rounded-3xl p-6 mb-4 shadow-lg border border-black/5">
      <div className="text-xs text-[#6677a2] mb-2">{location.label}</div>
      
      <div className="flex items-start justify-between gap-5">
        <div>
          <div className="text-5xl font-extrabold leading-none text-[#101c46] mb-1">
            {weather.temp}°
          </div>
          <div className="text-lg text-[#2c3e70] font-semibold mb-2">
            {weather.description.charAt(0).toUpperCase() + weather.description.slice(1)}
          </div>
          <div className="flex flex-wrap gap-4 text-xs text-[#62739d]">
            {detailBits.map((bit, i) => (
              <span key={i}>{bit}</span>
            ))}
          </div>
        </div>
        
        <div className="text-center flex-shrink-0">
          <div className="flex items-center justify-center">
            {getWeatherIcon(weather.condition, 16)}
          </div>
        </div>
      </div>
    </div>
  );
}