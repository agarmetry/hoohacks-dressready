import { MapPin, Cloud, CloudRain, Sun, CloudSnow, Wind, CloudDrizzle } from 'lucide-react';
import { WeatherCondition } from '../services/weather';
import { motion } from 'motion/react';

interface WeatherTheme {
  background: string;
  cardBg: string;
  headerBg: string;
  textPrimary: string;
  textSecondary: string;
  accentColor: string;
}

interface WeatherHeaderProps {
  location: string;
  weather: WeatherCondition;
  theme?: WeatherTheme;
}

const WeatherIcon = ({ icon, size = 80 }: { icon: string; size?: number }) => {
  const iconProps = { size, strokeWidth: 1.5, className: 'text-yellow-500' };
  
  switch (icon) {
    case 'sun':
      return <Sun {...iconProps} fill="currentColor" />;
    case 'cloud':
      return <Cloud {...iconProps} />;
    case 'cloud-rain':
      return <CloudRain {...iconProps} className="text-blue-500" />;
    case 'cloud-drizzle':
      return <CloudDrizzle {...iconProps} className="text-blue-500" />;
    case 'snowflake':
      return <CloudSnow {...iconProps} className="text-blue-300" />;
    case 'wind':
      return <Wind {...iconProps} />;
    default:
      return <Cloud {...iconProps} />;
  }
};

export function WeatherHeader({ location, weather, theme }: WeatherHeaderProps) {
  const defaultTheme: WeatherTheme = {
    background: 'bg-gradient-to-br from-blue-500 to-blue-600',
    cardBg: 'rounded-3xl p-8 text-white shadow-lg',
    headerBg: 'bg-gradient-to-br from-blue-500 to-blue-600',
    textPrimary: 'text-white',
    textSecondary: 'text-blue-100',
    accentColor: 'text-blue-500'
  };

  const currentTheme = theme || defaultTheme;

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`${currentTheme.background} ${currentTheme.cardBg}`}
    >
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex items-center gap-2 mb-6"
      >
        <MapPin className="size-5" />
        <span className="text-lg">{location}</span>
      </motion.div>

      <div className="flex items-center justify-between">
        <div>
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            className="text-7xl font-light mb-2"
          >
            {weather.temperature}°
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl mb-1"
          >
            {weather.condition.text}
          </motion.div>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className={currentTheme.textSecondary}
          >
            H:{weather.high}° L:{weather.low}°
          </motion.div>
        </div>

        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 200, damping: 15 }}
          whileHover={{ scale: 1.1, rotate: 10 }}
        >
          <WeatherIcon icon={weather.condition.icon} size={120} />
        </motion.div>
      </div>
    </motion.div>
  );
}

export { WeatherIcon };