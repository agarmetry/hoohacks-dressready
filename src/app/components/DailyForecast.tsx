import { DailyForecast as DailyForecastType } from '../services/weather';
import { WeatherIcon } from './WeatherHeader';
import { motion } from 'motion/react';

interface WeatherTheme {
  background: string;
  cardBg: string;
  headerBg: string;
  textPrimary: string;
  textSecondary: string;
  accentColor: string;
}

interface DailyForecastProps {
  forecast: DailyForecastType[];
  selectedDayIndex?: number;
  onDaySelect?: (index: number) => void;
  theme?: WeatherTheme;
}

export function DailyForecast({ forecast, selectedDayIndex = 0, onDaySelect, theme }: DailyForecastProps) {
  const defaultTheme: WeatherTheme = {
    background: 'bg-gray-100',
    cardBg: 'bg-white',
    headerBg: 'bg-gray-900',
    textPrimary: 'text-gray-900',
    textSecondary: 'text-gray-500',
    accentColor: 'text-gray-600'
  };

  const currentTheme = theme || defaultTheme;

  return (
    <div className="overflow-x-auto -mx-6 px-6">
      <div className="flex gap-3 min-w-max">
        {forecast.map((day, index) => {
          const isSelected = index === selectedDayIndex;
          
          return (
            <motion.button
              key={index}
              onClick={() => onDaySelect?.(index)}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              className={`flex flex-col items-center gap-2 py-4 px-5 rounded-2xl min-w-[100px] transition-colors ${
                isSelected 
                  ? 'bg-gray-900 text-white' 
                  : 'bg-white text-gray-900 hover:bg-gray-50'
              }`}
            >
              <div className={`text-sm font-medium ${isSelected ? 'text-white' : 'text-gray-600'}`}>
                {day.day}
              </div>
              <motion.div 
                className="my-1"
                animate={isSelected ? { rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] } : {}}
                transition={{ duration: 0.5 }}
              >
                <WeatherIcon icon={day.icon} size={40} />
              </motion.div>
              <div className="text-base font-medium">
                {day.high}°
              </div>
              <div className={`text-sm ${isSelected ? 'text-gray-300' : 'text-gray-500'}`}>
                {day.low}°
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}