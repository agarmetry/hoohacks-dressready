import { HourlyForecast as HourlyForecastType } from '../services/weather';
import { WeatherIcon } from './WeatherHeader';
import { useState } from 'react';
import { motion } from 'motion/react';

interface HourlyForecastProps {
  forecast: HourlyForecastType[];
  currentHour: number;
}

export function HourlyForecast({ forecast, currentHour }: HourlyForecastProps) {
  const [selectedHourIndex, setSelectedHourIndex] = useState(0);
  
  // Show next 12 hours
  const displayForecast = forecast.slice(0, 12);
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="bg-white rounded-3xl p-6 shadow-sm"
    >
      <div className="flex items-center justify-between mb-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-sm font-medium text-gray-700"
        >
          Hourly Forecast
        </motion.div>
        {selectedHourIndex > 0 && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-xs text-gray-500"
          >
            {displayForecast[selectedHourIndex].time}: {displayForecast[selectedHourIndex].temperature}° - {displayForecast[selectedHourIndex].condition}
          </motion.div>
        )}
      </div>
      
      <div className="overflow-x-auto -mx-6 px-6">
        <div className="flex gap-4 min-w-max">
          {displayForecast.map((item, index) => {
            const isCurrent = index === 0;
            const isSelected = index === selectedHourIndex;
            
            return (
              <motion.button
                key={index}
                onClick={() => setSelectedHourIndex(index)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.05 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex flex-col items-center gap-2 py-3 px-4 rounded-2xl min-w-[80px] transition-all ${
                  isSelected ? 'bg-blue-100 scale-105' : isCurrent ? 'bg-blue-50' : 'hover:bg-gray-50'
                }`}
              >
                <div className={`text-sm ${isSelected ? 'font-bold text-blue-700' : isCurrent ? 'font-semibold text-blue-600' : 'text-gray-600'}`}>
                  {index === 0 ? 'Now' : item.time}
                </div>
                <motion.div
                  animate={isSelected ? { rotate: [0, 10, -10, 0] } : {}}
                  transition={{ duration: 0.5 }}
                >
                  <WeatherIcon icon={item.icon} size={32} />
                </motion.div>
                <div className={`text-lg font-medium ${isSelected ? 'text-blue-700' : isCurrent ? 'text-blue-600' : 'text-gray-900'}`}>
                  {item.temperature}°
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}