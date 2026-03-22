import { useState } from 'react';
import { Cloud, CloudRain, Sun, ArrowDown, ArrowUp, ArrowUpRight, ArrowDownRight, Droplets, Wind as WindIcon, Thermometer } from 'lucide-react';
import { getWeatherIcon } from '../../utils/weatherIcons';
import type { HourlyForecast, Weather } from '../data/mockData';

interface TodayDetailedForecastProps {
  hourlyData: HourlyForecast[];
  currentWeather: Weather;
  selectedDayIndex: number;
}

type Tab = 'temperature' | 'precipitation' | 'wind';

function getWindDirectionIcon(hour: number) {
  // Simulate wind direction based on time of day
  if (hour < 6) return <ArrowDown className="size-4" />;
  if (hour < 12) return <ArrowUpRight className="size-4" />;
  if (hour < 18) return <ArrowUp className="size-4" />;
  return <ArrowDownRight className="size-4" />;
}

export function TodayDetailedForecast({ hourlyData, currentWeather, selectedDayIndex }: TodayDetailedForecastProps) {
  const [activeTab, setActiveTab] = useState<Tab>('temperature');
  const [hoveredHour, setHoveredHour] = useState<number | null>(null);

  // Determine data interval (hourly vs 3-hour intervals)
  // If we have ~192 items, it's hourly mock data (8 days × 24 hours)
  // If we have ~40 items, it's 3-hour interval API data (5 days × 8 intervals)
  const isHourlyData = hourlyData.length > 100; // Mock data
  const intervalsPerDay = isHourlyData ? 24 : 8;
  
  // Get current time
  const now = new Date();
  const currentHour = now.getHours();
  
  // Find the starting index for the selected day
  let startIndex = 0;
  
  if (selectedDayIndex === 0) {
    // Today - find the closest hour in the data
    if (isHourlyData) {
      // For hourly data, find exact hour match
      const currentHourIndex = hourlyData.findIndex(h => h.hour === currentHour);
      startIndex = currentHourIndex >= 0 ? currentHourIndex : 0;
    } else {
      // For 3-hour interval data, find the first interval that hasn't passed yet
      const currentTimeMs = now.getTime();
      startIndex = hourlyData.findIndex((h, idx) => {
        // Estimate the timestamp for this data point
        // Each data point is 3 hours apart
        const estimatedTime = Date.now() + (idx * 3 * 60 * 60 * 1000);
        return estimatedTime >= currentTimeMs;
      });
      if (startIndex < 0) startIndex = 0;
    }
  } else {
    // For other days, calculate offset from today
    const baseIndex = isHourlyData 
      ? hourlyData.findIndex(h => h.hour === currentHour)
      : 0;
    startIndex = Math.max(0, (baseIndex >= 0 ? baseIndex : 0) + (selectedDayIndex * intervalsPerDay));
  }
  
  // Get 12 data points for display
  const displayHours = hourlyData.slice(startIndex, startIndex + 12);
  
  // If we don't have enough data, return early with a message
  if (displayHours.length === 0) {
    return (
      <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 mb-4 shadow-lg border border-gray-200 text-center">
        <p className="text-gray-600">No hourly forecast data available for this date.</p>
      </div>
    );
  }

  // Calculate temperature range for chart scaling
  const temps = displayHours.map(h => h.temperature);
  const maxTemp = Math.max(...temps);
  const minTemp = Math.min(...temps);
  const tempRange = maxTemp - minTemp;

  // Calculate chart heights (percentage of container)
  const getChartHeight = (temp: number) => {
    if (tempRange === 0 || tempRange < 2) {
      // If all temperatures are the same or very close, return 50%
      return 50;
    }
    // Map temperature to 30-100% range for better visibility
    const normalized = (temp - minTemp) / tempRange;
    const height = 30 + (normalized * 70);
    return height;
  };

  const isToday = selectedDayIndex === 0;

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 mb-4 shadow-lg border border-gray-200">
      {/* Header with weather info */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4">
            {getWeatherIcon(currentWeather.condition, 16)}
            <div>
              <div className="text-gray-900 text-6xl font-light">
                {currentWeather.temp}
                <span className="text-3xl align-top">°</span>
              </div>
              <div className="text-gray-600 text-sm mt-1">{currentWeather.condition}</div>
            </div>
          </div>
          <div className="text-sm text-gray-700 space-y-2 pl-6 border-l border-gray-200">
            <div className="flex items-center gap-2">
              <Droplets className="size-4 text-blue-500" />
              <span>Precipitation: {displayHours[0]?.precipitationChance || 0}%</span>
            </div>
            <div className="flex items-center gap-2">
              <Droplets className="size-4 text-cyan-500" />
              <span>Humidity: {currentWeather.humidity}%</span>
            </div>
            <div className="flex items-center gap-2">
              <WindIcon className="size-4 text-gray-500" />
              <span>Wind: {currentWeather.windSpeed} mph</span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-gray-900 text-2xl font-semibold">
            {isToday ? 'Today' : new Date(Date.now() + selectedDayIndex * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { weekday: 'long' })}
          </div>
          <div className="text-gray-500 text-sm mt-1">
            {new Date(Date.now() + selectedDayIndex * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-gray-100 rounded-xl p-1">
        <button
          onClick={() => setActiveTab('temperature')}
          className={`flex-1 px-4 py-3 text-sm font-medium rounded-lg transition-all ${
            activeTab === 'temperature'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <Thermometer className="size-4" />
            Temperature
          </div>
        </button>
        <button
          onClick={() => setActiveTab('precipitation')}
          className={`flex-1 px-4 py-3 text-sm font-medium rounded-lg transition-all ${
            activeTab === 'precipitation'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <Droplets className="size-4" />
            Precipitation
          </div>
        </button>
        <button
          onClick={() => setActiveTab('wind')}
          className={`flex-1 px-4 py-3 text-sm font-medium rounded-lg transition-all ${
            activeTab === 'wind'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <WindIcon className="size-4" />
            Wind
          </div>
        </button>
      </div>

      {/* Chart Area */}
      <div className="relative h-56 mb-6 bg-gradient-to-b from-gray-50 to-white rounded-2xl p-4">
        {/* Temperature Chart */}
        {activeTab === 'temperature' && (
          <div className="h-full relative">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              {/* Draw line connecting temperature points */}
              <polyline
                points={displayHours.map((hour, index) => {
                  const x = (index / (displayHours.length - 1)) * 100;
                  const y = 100 - getChartHeight(hour.temperature);
                  return `${x},${y}`;
                }).join(' ')}
                fill="none"
                stroke="url(#tempGradient)"
                strokeWidth="0.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="drop-shadow-md"
              />
              
              {/* Gradient fill under the line */}
              <polygon
                points={[
                  ...displayHours.map((hour, index) => {
                    const x = (index / (displayHours.length - 1)) * 100;
                    const y = 100 - getChartHeight(hour.temperature);
                    return `${x},${y}`;
                  }),
                  '100,100',
                  '0,100'
                ].join(' ')}
                fill="url(#tempAreaGradient)"
                opacity="0.3"
              />
              
              {/* Points on the line */}
              {displayHours.map((hour, index) => {
                const x = (index / (displayHours.length - 1)) * 100;
                const y = 100 - getChartHeight(hour.temperature);
                const isHovered = hoveredHour === index;
                
                return (
                  <circle
                    key={index}
                    cx={x}
                    cy={y}
                    r={isHovered ? "1.5" : "0.8"}
                    fill={isHovered ? "#f97316" : "#fb923c"}
                    className="transition-all duration-200"
                    style={{ cursor: 'pointer' }}
                  />
                );
              })}
              
              {/* Gradient definitions */}
              <defs>
                <linearGradient id="tempGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#fbbf24" />
                  <stop offset="50%" stopColor="#fb923c" />
                  <stop offset="100%" stopColor="#f97316" />
                </linearGradient>
                <linearGradient id="tempAreaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#fbbf24" />
                  <stop offset="100%" stopColor="#f97316" />
                </linearGradient>
              </defs>
            </svg>
            
            {/* Temperature labels above each point */}
            <div className="absolute inset-0 flex items-end justify-between pointer-events-none">
              {displayHours.map((hour, index) => {
                const isHovered = hoveredHour === index;
                const yPercent = 100 - getChartHeight(hour.temperature);
                
                return (
                  <div
                    key={index}
                    className="flex-1 flex flex-col items-center justify-end"
                    style={{ 
                      height: '100%',
                    }}
                  >
                    <div 
                      className={`text-sm font-semibold transition-all ${
                        isHovered ? 'text-orange-600 scale-125' : 'text-orange-500'
                      }`}
                      style={{
                        position: 'relative',
                        bottom: `calc(${100 - yPercent}% + 8px)`,
                      }}
                    >
                      {hour.temperature}°
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Invisible hover areas */}
            <div className="absolute inset-0 flex">
              {displayHours.map((hour, index) => (
                <div
                  key={index}
                  className="flex-1 cursor-pointer"
                  onMouseEnter={() => setHoveredHour(index)}
                  onMouseLeave={() => setHoveredHour(null)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Precipitation Chart */}
        {activeTab === 'precipitation' && (
          <div className="h-full relative">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              {/* Draw line connecting precipitation points */}
              <polyline
                points={displayHours.map((hour, index) => {
                  const x = (index / (displayHours.length - 1)) * 100;
                  const y = 100 - hour.precipitationChance;
                  return `${x},${y}`;
                }).join(' ')}
                fill="none"
                stroke="url(#precipGradient)"
                strokeWidth="0.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="drop-shadow-md"
              />
              
              {/* Gradient fill under the line */}
              <polygon
                points={[
                  ...displayHours.map((hour, index) => {
                    const x = (index / (displayHours.length - 1)) * 100;
                    const y = 100 - hour.precipitationChance;
                    return `${x},${y}`;
                  }),
                  '100,100',
                  '0,100'
                ].join(' ')}
                fill="url(#precipAreaGradient)"
                opacity="0.3"
              />
              
              {/* Points on the line */}
              {displayHours.map((hour, index) => {
                const x = (index / (displayHours.length - 1)) * 100;
                const y = 100 - hour.precipitationChance;
                const isHovered = hoveredHour === index;
                
                return (
                  <circle
                    key={index}
                    cx={x}
                    cy={y}
                    r={isHovered ? "1.5" : "0.8"}
                    fill={isHovered ? "#2563eb" : "#60a5fa"}
                    className="transition-all duration-200"
                    style={{ cursor: 'pointer' }}
                  />
                );
              })}
              
              {/* Gradient definitions */}
              <defs>
                <linearGradient id="precipGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#60a5fa" />
                  <stop offset="100%" stopColor="#2563eb" />
                </linearGradient>
                <linearGradient id="precipAreaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#60a5fa" />
                  <stop offset="100%" stopColor="#2563eb" />
                </linearGradient>
              </defs>
            </svg>
            
            {/* Precipitation labels above each point */}
            <div className="absolute inset-0 flex items-end justify-between pointer-events-none">
              {displayHours.map((hour, index) => {
                const isHovered = hoveredHour === index;
                const yPercent = 100 - hour.precipitationChance;
                
                return (
                  <div
                    key={index}
                    className="flex-1 flex flex-col items-center justify-end"
                    style={{ 
                      height: '100%',
                    }}
                  >
                    <div 
                      className={`text-sm font-semibold transition-all ${
                        isHovered ? 'text-blue-600 scale-125' : 'text-blue-500'
                      }`}
                      style={{
                        position: 'relative',
                        bottom: `calc(${100 - yPercent}% + 8px)`,
                      }}
                    >
                      {hour.precipitationChance}%
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Invisible hover areas */}
            <div className="absolute inset-0 flex">
              {displayHours.map((hour, index) => (
                <div
                  key={index}
                  className="flex-1 cursor-pointer"
                  onMouseEnter={() => setHoveredHour(index)}
                  onMouseLeave={() => setHoveredHour(null)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Wind Chart */}
        {activeTab === 'wind' && (
          <div className="h-full relative">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              {/* Draw line connecting wind points */}
              <polyline
                points={displayHours.map((hour, index) => {
                  const maxWind = 20;
                  const height = Math.min((hour.windSpeed / maxWind) * 100, 100);
                  const x = (index / (displayHours.length - 1)) * 100;
                  const y = 100 - height;
                  return `${x},${y}`;
                }).join(' ')}
                fill="none"
                stroke="url(#windGradient)"
                strokeWidth="0.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="drop-shadow-md"
              />
              
              {/* Gradient fill under the line */}
              <polygon
                points={[
                  ...displayHours.map((hour, index) => {
                    const maxWind = 20;
                    const height = Math.min((hour.windSpeed / maxWind) * 100, 100);
                    const x = (index / (displayHours.length - 1)) * 100;
                    const y = 100 - height;
                    return `${x},${y}`;
                  }),
                  '100,100',
                  '0,100'
                ].join(' ')}
                fill="url(#windAreaGradient)"
                opacity="0.3"
              />
              
              {/* Points on the line */}
              {displayHours.map((hour, index) => {
                const maxWind = 20;
                const height = Math.min((hour.windSpeed / maxWind) * 100, 100);
                const x = (index / (displayHours.length - 1)) * 100;
                const y = 100 - height;
                const isHovered = hoveredHour === index;
                
                return (
                  <circle
                    key={index}
                    cx={x}
                    cy={y}
                    r={isHovered ? "1.5" : "0.8"}
                    fill={isHovered ? "#0891b2" : "#22d3ee"}
                    className="transition-all duration-200"
                    style={{ cursor: 'pointer' }}
                  />
                );
              })}
              
              {/* Gradient definitions */}
              <defs>
                <linearGradient id="windGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#22d3ee" />
                  <stop offset="100%" stopColor="#0891b2" />
                </linearGradient>
                <linearGradient id="windAreaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#22d3ee" />
                  <stop offset="100%" stopColor="#0891b2" />
                </linearGradient>
              </defs>
            </svg>
            
            {/* Wind speed labels and direction icons */}
            <div className="absolute inset-0 flex items-end justify-between pointer-events-none">
              {displayHours.map((hour, index) => {
                const isHovered = hoveredHour === index;
                const maxWind = 20;
                const height = Math.min((hour.windSpeed / maxWind) * 100, 100);
                const yPercent = 100 - height;
                
                return (
                  <div
                    key={index}
                    className="flex-1 flex flex-col items-center justify-end"
                    style={{ 
                      height: '100%',
                    }}
                  >
                    <div 
                      className="flex flex-col items-center"
                      style={{
                        position: 'relative',
                        bottom: `calc(${100 - yPercent}% + 8px)`,
                      }}
                    >
                      <div className={`text-sm font-semibold mb-1 transition-all ${
                        isHovered ? 'text-cyan-600 scale-125' : 'text-cyan-500'
                      }`}>
                        {hour.windSpeed}
                      </div>
                      <div className={`text-gray-600 transition-all ${isHovered ? 'scale-125' : ''}`}>
                        {getWindDirectionIcon(hour.hour)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Invisible hover areas */}
            <div className="absolute inset-0 flex">
              {displayHours.map((hour, index) => (
                <div
                  key={index}
                  className="flex-1 cursor-pointer"
                  onMouseEnter={() => setHoveredHour(index)}
                  onMouseLeave={() => setHoveredHour(null)}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Timeline Labels (Time of day) */}
      <div className="flex justify-between items-start border-t border-gray-200 pt-4">
        {displayHours.map((hour, index) => {
          const isHovered = hoveredHour === index;
          
          return (
            <div
              key={index}
              className={`flex-1 text-center cursor-pointer transition-all ${
                isHovered ? 'scale-105' : ''
              }`}
              onMouseEnter={() => setHoveredHour(index)}
              onMouseLeave={() => setHoveredHour(null)}
            >
              {/* Time */}
              <div className={`text-xs mb-2 font-medium transition-all ${
                isHovered ? 'text-gray-900' : 'text-gray-600'
              }`}>
                {hour.time}
              </div>
              
              {/* Weather icon */}
              <div className={`flex justify-center transition-all ${isHovered ? 'scale-125' : ''}`}>
                {getWeatherIcon(hour.condition, 5)}
              </div>
            </div>
          );
        })}
      </div>

      {/* Additional Weather Stats */}
      <div className="mt-6 pt-6 border-t border-gray-200 grid grid-cols-4 gap-6">
        <div className="text-center">
          <div className="text-gray-500 text-xs mb-1 uppercase tracking-wide">High / Low</div>
          <div className="text-gray-900 text-lg font-semibold">
            {currentWeather.tempMax}° / {currentWeather.tempMin}°
          </div>
        </div>
        <div className="text-center">
          <div className="text-gray-500 text-xs mb-1 uppercase tracking-wide">Feels Like</div>
          <div className="text-gray-900 text-lg font-semibold">{currentWeather.feelsLike}°</div>
        </div>
        <div className="text-center">
          <div className="text-gray-500 text-xs mb-1 uppercase tracking-wide">Humidity</div>
          <div className="text-gray-900 text-lg font-semibold">{currentWeather.humidity}%</div>
        </div>
        <div className="text-center">
          <div className="text-gray-500 text-xs mb-1 uppercase tracking-wide">Air Quality</div>
          <div className="text-gray-900 text-lg font-semibold">{currentWeather.aqiLabel || 'Good'}</div>
        </div>
      </div>
    </div>
  );
}