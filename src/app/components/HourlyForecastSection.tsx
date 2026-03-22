import { Cloud, CloudRain, Sun } from 'lucide-react';
import { getWeatherIcon } from '../../utils/weatherIcons';
import type { HourlyForecast } from '../data/mockData';

interface HourlyForecastSectionProps {
  hourlyData: HourlyForecast[];
}

export function HourlyForecastSection({ hourlyData }: HourlyForecastSectionProps) {
  const currentHour = new Date().getHours();
  
  return (
    <div className="bg-white/92 backdrop-blur-sm rounded-3xl p-6 mb-4 shadow-md border border-black/5">
      <h3 className="text-sm font-bold text-[#6677a2] mb-4 uppercase tracking-wide">
        Hourly Forecast (Next 12 Hours)
      </h3>
      
      <div className="overflow-x-auto -mx-2 px-2">
        <div className="flex gap-4 pb-2">
          {hourlyData.slice(0, 12).map((hour, index) => {
            const isCurrentHour = hour.hour === currentHour && index === 0;
            
            return (
              <div
                key={`hour-${index}`}
                className={`flex-shrink-0 text-center min-w-[60px] ${
                  isCurrentHour ? 'bg-purple-100 border-2 border-purple-500 rounded-xl p-2' : 'p-2'
                }`}
              >
                <div className="text-xs text-[#6677a2] mb-2 font-medium">
                  {isCurrentHour ? 'Now' : hour.time}
                </div>
                
                <div className="flex justify-center mb-2">
                  {getWeatherIcon(hour.condition)}
                </div>
                
                <div className="text-lg font-bold text-[#10204b] mb-1">
                  {hour.temperature}°
                </div>
                
                {hour.precipitationChance > 0 && (
                  <div className="text-xs text-blue-500 font-medium">
                    {hour.precipitationChance}%
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}