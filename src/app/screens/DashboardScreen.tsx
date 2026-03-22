import { useState, useMemo, useEffect } from 'react';
import { MapPin, ChevronDown, Bell, LogOut, User } from 'lucide-react';
import { WeatherHeaderCard } from '../components/WeatherHeaderCard';
import { DayStrip } from '../components/DayStrip';
import { HeroEventCard } from '../components/HeroEventCard';
import { NextHourCard } from '../components/NextHourCard';
import { EventCardItem } from '../components/EventCardItem';
import { EmptyState } from '../components/EmptyState';
import { FloatingPlusButton } from '../components/FloatingPlusButton';
import { LocationSettings } from '../components/LocationSettings';
import { NotificationSettings } from '../components/NotificationSettings';
import { HourlyForecastSection } from '../components/HourlyForecastSection';
import { DailyForecastSection } from '../components/DailyForecastSection';
import { TodayDetailedForecast } from '../components/TodayDetailedForecast';
import { useWeatherData } from '../../hooks/useWeatherData';
import { useCalendarEvents } from '../../hooks/useCalendarEvents';
import { useNotifications } from '../../hooks/useNotifications';
import { mockLocation, DRESS_CODE_ORDER } from '../data/mockData';
import { APP_SETTINGS } from '../../config/settings';
import type { CalendarEvent } from '../data/mockData';
import type { GoogleAuthUser } from '../../services/googleAuth';

interface DashboardScreenProps {
  preferences: {
    styleVibe: string;
    colorPalette: string;
    priority: string;
  };
  user: GoogleAuthUser | null;
  onLogout: () => void;
}

export function DashboardScreen({ preferences, user, onLogout }: DashboardScreenProps) {
  const [selectedDayIndex, setSelectedDayIndex] = useState(7); // Start at "today" which is index 7
  const [showLocationSettings, setShowLocationSettings] = useState(false);
  const [showNotificationSettings, setShowNotificationSettings] = useState(false);
  const [location, setLocation] = useState(mockLocation);
  
  // Notification hook for scheduling event reminders
  const { scheduleEventNotifications, clearScheduledNotifications } = useNotifications();

  // Generate dates: 7 days in the past + today + future days
  // Extend future days based on selectedDayIndex to allow unlimited forward navigation
  const dates = useMemo(() => {
    const pastDays = 7;
    const futureDays = Math.max(8, selectedDayIndex - pastDays + 4);
    const totalDays = pastDays + 1 + futureDays; // past + today + future
    
    return Array.from({ length: totalDays }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - pastDays + i);
      return date;
    });
  }, [selectedDayIndex]);

  const selectedDate = dates[selectedDayIndex] || new Date();
  
  // Today is at index 7 (after 7 past days)
  const todayIndex = 7;
  
  // Calculate the offset from today for the selected date
  const dayOffsetFromToday = selectedDayIndex - todayIndex;
  
  // Weather data availability depends on whether we're using mock or real data
  // Mock data: 8 days of hourly forecasts (192 hours)
  // Real API data: 5 days of 3-hour interval forecasts (40 data points)
  const maxForecastDays = APP_SETTINGS.USE_MOCK_WEATHER ? 8 : 5;
  const hasWeatherData = dayOffsetFromToday >= 0 && dayOffsetFromToday < maxForecastDays;
  
  // Map the selected date to the weather data index
  // For past dates, we'll use the available data as if it were forecast
  const weatherDataIndex = Math.max(0, Math.min(maxForecastDays - 1, dayOffsetFromToday));

  // Fetch weather data from API (or mock data in development)
  const weatherData = useWeatherData(location.lat, location.lon, APP_SETTINGS.USE_MOCK_WEATHER);

  // Fetch calendar events from API (or mock data in development)
  const { events, loading: eventsLoading, error: eventsError } = useCalendarEvents(
    selectedDate,
    selectedDate,
    APP_SETTINGS.USE_MOCK_CALENDAR
  );

  // Separate upcoming and past events
  const { upcomingEvents, pastEvents, allEvents } = useMemo(() => {
    if (!selectedDate) {
      return { upcomingEvents: [], pastEvents: [], allEvents: [] };
    }
    
    const now = new Date();
    const todayDate = new Date();
    todayDate.setHours(0, 0, 0, 0);
    
    const selectedDateOnly = new Date(selectedDate);
    selectedDateOnly.setHours(0, 0, 0, 0);

    // If selected date is in the past, all events are past
    if (selectedDateOnly < todayDate) {
      return {
        upcomingEvents: [],
        pastEvents: [...events].sort((a, b) => b.start.getTime() - a.start.getTime()),
        allEvents: [...events].sort((a, b) => b.start.getTime() - a.start.getTime()),
      };
    }

    // If selected date is in the future, all events are upcoming
    if (selectedDateOnly > todayDate) {
      return {
        upcomingEvents: [...events].sort((a, b) => a.start.getTime() - b.start.getTime()),
        pastEvents: [],
        allEvents: [...events].sort((a, b) => a.start.getTime() - b.start.getTime()),
      };
    }

    // Today: split by current time
    const upcoming = events.filter(event => event.end > now).sort((a, b) => a.start.getTime() - b.start.getTime());
    const past = events.filter(event => event.end <= now).sort((a, b) => b.start.getTime() - a.start.getTime());

    return {
      upcomingEvents: upcoming,
      pastEvents: past,
      allEvents: [...upcoming, ...past],
    };
  }, [events, selectedDate]);

  // Get hero event (most formal upcoming event)
  const heroEvent = useMemo(() => {
    if (upcomingEvents.length === 0) return null;
    return upcomingEvents.reduce((mostFormal, event) => {
      const currentIndex = DRESS_CODE_ORDER.indexOf(event.dressCode);
      const mostFormalIndex = DRESS_CODE_ORDER.indexOf(mostFormal.dressCode);
      return currentIndex > mostFormalIndex ? event : mostFormal;
    }, upcomingEvents[0]);
  }, [upcomingEvents]);

  // Get next hour event
  const nextHourEvent = useMemo(() => {
    const now = new Date();
    const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);
    
    for (const event of upcomingEvents) {
      if (event.start >= now && event.start <= oneHourLater) {
        const minutesUntil = Math.round((event.start.getTime() - now.getTime()) / (1000 * 60));
        return { event, minutesUntil };
      }
    }
    return null;
  }, [upcomingEvents]);

  // Check if outfit changes needed
  const needsOutfitChange = useMemo(() => {
    if (allEvents.length < 2) return false;
    
    for (let i = 1; i < allEvents.length; i++) {
      const prevIndex = DRESS_CODE_ORDER.indexOf(allEvents[i - 1].dressCode);
      const currIndex = DRESS_CODE_ORDER.indexOf(allEvents[i].dressCode);
      if (currIndex > prevIndex) return true;
    }
    return false;
  }, [allEvents]);

  const isToday = selectedDayIndex === todayIndex;
  const isDayComplete = isToday && upcomingEvents.length === 0 && pastEvents.length > 0;

  // Schedule notifications for hero and next events when viewing today
  useEffect(() => {
    // Only schedule notifications when viewing today
    if (!isToday) {
      clearScheduledNotifications();
      return;
    }

    // Clear previous notifications
    clearScheduledNotifications();

    // Schedule notification for hero event
    if (heroEvent) {
      scheduleEventNotifications(heroEvent, true);
    }

    // Schedule notification for next hour event (if different from hero event)
    if (nextHourEvent && nextHourEvent.event.id !== heroEvent?.id) {
      scheduleEventNotifications(nextHourEvent.event, false);
    }

    // Cleanup scheduled notifications when component unmounts
    return () => {
      clearScheduledNotifications();
    };
    // Only re-run when these values change, not when the functions change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isToday, heroEvent?.id, nextHourEvent?.event.id]);

  // Show loading state
  if (weatherData.loading || eventsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center"
        style={{
          background: 'radial-gradient(circle at top left, rgba(190,216,255,.55), transparent 28%), radial-gradient(circle at bottom right, rgba(213,190,255,.38), transparent 24%), linear-gradient(180deg, #fbfcff 0%, #f7f8fc 100%)',
        }}
      >
        <div className="text-center">
          <div className="text-4xl mb-3">⏳</div>
          <p className="text-[#6677a2]">Loading your schedule...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen"
      style={{
        background: 'radial-gradient(circle at top left, rgba(190,216,255,.55), transparent 28%), radial-gradient(circle at bottom right, rgba(213,190,255,.38), transparent 24%), linear-gradient(180deg, #fbfcff 0%, #f7f8fc 100%)',
      }}
    >
      <div className="max-w-2xl mx-auto px-6 pt-6 pb-24">
        {/* User Profile & Logout */}
        {user && (
          <div className="flex items-center justify-between mb-4 bg-white/60 backdrop-blur-sm rounded-2xl p-3 shadow-sm border border-black/5">
            <div className="flex items-center gap-3">
              {user.picture ? (
                <img 
                  src={user.picture} 
                  alt={user.name} 
                  className="size-10 rounded-full border-2 border-purple-200"
                />
              ) : (
                <div className="size-10 rounded-full bg-purple-100 flex items-center justify-center border-2 border-purple-200">
                  <User className="size-5 text-purple-600" />
                </div>
              )}
              <div>
                <p className="text-sm font-bold text-[#0f2048]">{user.name}</p>
                <p className="text-xs text-[#6677a2]">{user.email}</p>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="flex items-center gap-2 px-3 py-2 text-sm text-[#6677a2] hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Sign out"
            >
              <LogOut className="size-4" />
              <span className="hidden sm:inline">Sign out</span>
            </button>
          </div>
        )}

        {/* Style Profile Display */}
        <div className="text-sm text-[#65769f] mb-4">
          Style: {preferences.styleVibe} | {preferences.colorPalette} | {preferences.priority}
        </div>

        {/* Day Strip */}
        <DayStrip
          dates={dates}
          selectedIndex={selectedDayIndex}
          onSelect={setSelectedDayIndex}
        />

        {/* Location Settings */}
        <div className="mb-4">
          <button
            onClick={() => setShowLocationSettings(!showLocationSettings)}
            className="text-sm text-[#6677a2] flex items-center gap-2 hover:text-[#2f67ff] transition-colors"
          >
            <MapPin className="size-4" />
            <span>Location settings</span>
            <ChevronDown className={`size-4 transition-transform ${showLocationSettings ? 'rotate-180' : ''}`} />
          </button>
          
          {showLocationSettings && (
            <LocationSettings
              location={location}
              onLocationChange={setLocation}
            />
          )}
        </div>

        {/* Notification Settings */}
        <div className="mb-4">
          <button
            onClick={() => setShowNotificationSettings(!showNotificationSettings)}
            className="text-sm text-[#6677a2] flex items-center gap-2 hover:text-[#2f67ff] transition-colors"
          >
            <Bell className="size-4" />
            <span>Notification settings</span>
            <ChevronDown className={`size-4 transition-transform ${showNotificationSettings ? 'rotate-180' : ''}`} />
          </button>
          
          {showNotificationSettings && (
            <NotificationSettings />
          )}
        </div>

        {/* Detailed Weather Forecast - Interactive Temperature/Precipitation/Wind Charts */}
        {hasWeatherData && weatherData.current && (
          <TodayDetailedForecast
            hourlyData={weatherData.hourly}
            currentWeather={weatherData.current}
            selectedDayIndex={dayOffsetFromToday}
          />
        )}
        
        {/* No Weather Available for Far Future Dates */}
        {!hasWeatherData && (
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 mb-4 shadow-lg border border-gray-200 text-center">
            <div className="text-6xl mb-4">🌤️</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Weather Forecast Not Available
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed max-w-md mx-auto">
              Weather data is only available for the next {maxForecastDays} days. You're viewing{' '}
              {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}.
              <br />
              {events.length > 0 && 'Your calendar events are still shown below.'}
            </p>
          </div>
        )}

        {/* API Error Notifications */}
        {weatherData.error && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-3 mb-4 text-yellow-800 text-xs">
            ⚠️ {weatherData.error}
          </div>
        )}
        {eventsError && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-3 mb-4 text-yellow-800 text-xs">
            ⚠️ {eventsError}
          </div>
        )}

        {/* Outfit Change Warning */}
        {needsOutfitChange && (
          <div className="bg-[#fff8e7] border border-[#f2d07c] rounded-2xl p-4 mb-4 text-[#8d6402] text-sm">
            ⚠️ Outfit change needed. You have events with clashing dress codes today.
          </div>
        )}

        {/* Hero Card */}
        {isDayComplete ? (
          <div className="bg-gradient-to-b from-[#252949] to-[#1d2142] rounded-3xl p-8 mb-5 text-white">
            <div className="inline-block bg-white/12 text-white/92 rounded-full px-3 py-2 text-xs font-bold mb-5">
              Day complete
            </div>
            <h3 className="text-xl font-extrabold mb-2">You're all done for today.</h3>
            <p className="text-white/82 text-sm leading-relaxed">
              Check tomorrow's forecast to plan ahead. Balanced day - dress code and weather both matter.
            </p>
          </div>
        ) : heroEvent ? (
          <HeroEventCard event={heroEvent} />
        ) : null}

        {/* Next Hour Card */}
        {nextHourEvent && !isDayComplete && (
          <NextHourCard event={nextHourEvent.event} minutesUntil={nextHourEvent.minutesUntil} />
        )}

        {/* Events List */}
        {allEvents.length === 0 ? (
          <EmptyState date={selectedDate} />
        ) : (
          <div>
            <h2 className="text-lg font-extrabold text-[#10204b] my-5">
              {isToday ? "Today's Schedule" : selectedDate ? `${selectedDate.toLocaleDateString('en-US', { weekday: 'long' })}'s Schedule` : 'Schedule'}
            </h2>

            {upcomingEvents.length === 0 && pastEvents.length > 0 && (
              <div className="text-center text-xs uppercase tracking-widest text-[#7d8ab0] my-5">
                No upcoming events
              </div>
            )}

            <div className="space-y-4">
              {allEvents.map((event) => (
                <EventCardItem
                  key={event.id}
                  event={event}
                  isPast={pastEvents.includes(event)}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Floating Plus Button */}
      <FloatingPlusButton />
    </div>
  );
}