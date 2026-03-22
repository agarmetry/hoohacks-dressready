import { Cloud, CloudRain, Sun } from 'lucide-react';
import { getWeatherIcon } from '../../utils/weatherIcons';
import type { DailyForecast } from '../data/mockData';

interface DailyForecastSectionProps {
  dailyData: DailyForecast[];
}

export function DailyForecastSection({ dailyData }: DailyForecastSectionProps) {
  return (
    <div className="bg-white/92 backdrop-blur-sm rounded-3xl p-6 mb-4 shadow-md border border-black/5">
      <h3 className="text-sm font-bold text-[#6677a2] mb-4 uppercase tracking-wide">
        8-Day Forecast
      </h3>
      
      <div className="space-y-2">
        {dailyData.map((day, index) => {
          const isToday = index === 0;
          const dayLabel = isToday ? 'Today' : day.date.toLocaleDateString('en-US', { weekday: 'short' });
          const dateLabel = day.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          
          return (
            <button
              key={index}
              className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${
                index === 0
                  ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-md'
                  : 'hover:bg-gray-100 text-[#10204b]'
              }`}
            >
              <div className="flex items-center gap-4 flex-1">
                <div className="text-sm font-bold w-16 text-left">
                  {dayLabel}
                </div>
                
                <div className="text-xs opacity-70">
                  {dateLabel}
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                {getWeatherIcon(day.condition)}
                
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold">{day.high}°</span>
                  <span className={`text-sm ${index === 0 ? 'opacity-70' : 'text-gray-500'}`}>
                    {day.low}°
                  </span>
                </div>
                
                {day.precipitationChance > 20 && (
                  <div className={`text-xs ${index === 0 ? 'opacity-80' : 'text-blue-500'} font-medium w-8 text-right`}>
                    {day.precipitationChance}%
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}