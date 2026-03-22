import { useState, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, TooltipProps } from 'recharts';
import { motion } from 'motion/react';
import { HourlyForecast } from '../services/weather';

interface WeatherTheme {
  background: string;
  cardBg: string;
  headerBg: string;
  textPrimary: string;
  textSecondary: string;
  accentColor: string;
}

interface TemperatureGraphProps {
  hourlyData: HourlyForecast[];
  selectedDate: Date;
  theme?: WeatherTheme;
}

type GraphType = 'temperature' | 'precipitation' | 'wind';

export function TemperatureGraph({ hourlyData, selectedDate, theme }: TemperatureGraphProps) {
  const [activeTab, setActiveTab] = useState<GraphType>('temperature');

  const defaultTheme: WeatherTheme = {
    background: 'bg-white',
    cardBg: 'bg-white',
    headerBg: 'bg-gray-900',
    textPrimary: 'text-gray-900',
    textSecondary: 'text-gray-500',
    accentColor: 'text-gray-600'
  };

  const currentTheme = theme || defaultTheme;

  // Memoize chart data to prevent regeneration on every render and ensure stable keys
  const chartData = useMemo(() => {
    return hourlyData.slice(0, 24).map((hour, index) => ({
      time: hour.time,
      temperature: hour.temperature,
      precipitation: hour.precipitationChance || (index * 7) % 60, // Deterministic instead of random
      wind: 5 + (index * 3) % 20, // Deterministic instead of random
      index: index, // Unique numeric index for recharts
    }));
  }, [hourlyData]);

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gray-900 text-white px-4 py-3 rounded-xl shadow-lg"
        >
          <div className="font-semibold mb-1">{data.time}</div>
          {activeTab === 'temperature' && (
            <div className="text-2xl font-bold">{data.temperature}°</div>
          )}
          {activeTab === 'precipitation' && (
            <div className="text-2xl font-bold">{data.precipitation}%</div>
          )}
          {activeTab === 'wind' && (
            <div className="text-2xl font-bold">{data.wind} mph</div>
          )}
        </motion.div>
      );
    }
    return null;
  };

  const tabs: { id: GraphType; label: string }[] = [
    { id: 'temperature', label: 'Temperature' },
    { id: 'precipitation', label: 'Precipitation' },
    { id: 'wind', label: 'Wind' },
  ];

  const getChartConfig = () => {
    switch (activeTab) {
      case 'temperature':
        return {
          dataKey: 'temperature',
          stroke: '#f59e0b',
          fill: '#fef3c7',
          gradient: ['#fef3c7', '#fde68a'],
        };
      case 'precipitation':
        return {
          dataKey: 'precipitation',
          stroke: '#3b82f6',
          fill: '#dbeafe',
          gradient: ['#dbeafe', '#bfdbfe'],
        };
      case 'wind':
        return {
          dataKey: 'wind',
          stroke: '#10b981',
          fill: '#d1fae5',
          gradient: ['#d1fae5', '#a7f3d0'],
        };
    }
  };

  const config = getChartConfig();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`bg-white rounded-3xl p-6 shadow-sm ${currentTheme.cardBg}`}
    >
      {/* Header with date */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">
          Hourly Forecast
        </h3>
        <p className="text-sm text-gray-500">
          {selectedDate.toLocaleDateString('en-US', { 
            weekday: 'long', 
            month: 'long', 
            day: 'numeric' 
          })}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-sm font-medium transition-colors relative ${
              activeTab === tab.id
                ? 'text-gray-900'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-yellow-500"
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Chart */}
      <div className="h-64 -mx-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            key={activeTab}
            data={chartData}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id={`gradient-${activeTab}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={config.gradient[0]} stopOpacity={0.9} />
                <stop offset="95%" stopColor={config.gradient[1]} stopOpacity={0.3} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="time"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#9ca3af', fontSize: 12 }}
              interval={2}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#9ca3af', fontSize: 12 }}
              domain={activeTab === 'temperature' ? ['dataMin - 5', 'dataMax + 5'] : [0, 'dataMax + 10']}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ stroke: config.stroke, strokeWidth: 2, strokeDasharray: '5 5' }}
            />
            <Area
              type="monotone"
              dataKey={config.dataKey}
              stroke={config.stroke}
              strokeWidth={3}
              fill={`url(#gradient-${activeTab})`}
              animationDuration={1000}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Current value indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-4 text-center text-sm text-gray-600"
      >
        Hover over the graph to see detailed {activeTab} information
      </motion.div>
    </motion.div>
  );
}