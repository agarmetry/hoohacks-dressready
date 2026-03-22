import { motion } from 'motion/react';

interface WeatherTheme {
  background: string;
  cardBg: string;
  headerBg: string;
  textPrimary: string;
  textSecondary: string;
  accentColor: string;
}

interface DateSelectorProps {
  dates: Date[];
  selectedIndex: number;
  onSelect: (index: number) => void;
  theme?: WeatherTheme;
}

export function DateSelector({ dates, selectedIndex, onSelect, theme }: DateSelectorProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 -mx-6 px-6">
      {dates.map((date, index) => {
        const isSelected = index === selectedIndex;
        const isToday = index === 0;
        
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
        const monthDay = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        
        return (
          <motion.button
            key={index}
            onClick={() => onSelect(index)}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`flex-shrink-0 px-6 py-3 rounded-full text-sm font-medium transition-all ${
              isSelected
                ? 'bg-gray-900 text-white shadow-md scale-105'
                : theme?.cardBg || 'bg-white text-gray-700 hover:bg-gray-100 hover:shadow-sm'
            }`}
          >
            {isToday ? `Today ${monthDay}` : `${dayName} ${monthDay}`}
          </motion.button>
        );
      })}
    </div>
  );
}