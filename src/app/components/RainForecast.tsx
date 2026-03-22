import { motion } from 'motion/react';
import { CloudRain, Droplets } from 'lucide-react';
import { HourlyForecast } from '../services/weather';

interface RainForecastProps {
  hourlyData: HourlyForecast[];
}

export function RainForecast({ hourlyData }: RainForecastProps) {
  // Get next 12 hours of precipitation data
  const rainData = hourlyData.slice(0, 12).map(hour => ({
    time: hour.time,
    chance: hour.precipitationChance || 0,
  }));

  const maxChance = Math.max(...rainData.map(d => d.chance));

  if (maxChance === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-blue-900/90 backdrop-blur-sm rounded-3xl p-6 shadow-lg"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-blue-500/30 p-3 rounded-2xl">
          <CloudRain className="size-6 text-blue-300" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">Rain Forecast</h3>
          <p className="text-sm text-blue-200">Next 12 hours</p>
        </div>
      </div>

      {/* Rain bars */}
      <div className="space-y-3">
        {rainData.map((data, index) => (
          <motion.div
            key={`rain-${index}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex items-center gap-4"
          >
            <div className="w-16 text-sm text-blue-200 font-medium">{data.time}</div>
            <div className="flex-1 h-8 bg-blue-950/50 rounded-full overflow-hidden relative">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${data.chance}%` }}
                transition={{ duration: 0.8, delay: index * 0.05 }}
                className="h-full bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-end pr-3"
              >
                {data.chance > 15 && (
                  <Droplets className="size-4 text-white" />
                )}
              </motion.div>
            </div>
            <div className="w-12 text-sm text-blue-100 font-semibold text-right">
              {data.chance}%
            </div>
          </motion.div>
        ))}
      </div>

      {/* Summary */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-6 pt-6 border-t border-blue-700/50 text-center"
      >
        <p className="text-blue-200 text-sm">
          {maxChance > 70 ? '🌧️ Heavy rain expected' : maxChance > 40 ? '🌦️ Light rain likely' : '☁️ Chance of showers'}
        </p>
      </motion.div>
    </motion.div>
  );
}
