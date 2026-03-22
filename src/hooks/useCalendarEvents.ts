import { useState, useEffect } from 'react';
import { calendarAPI } from '../services/api';
import { getMockEvents } from '../app/data/mockData';
import type { CalendarEvent } from '../app/data/mockData';

interface CalendarState {
  events: CalendarEvent[];
  loading: boolean;
  error: string | null;
}

export function useCalendarEvents(startDate: Date, endDate: Date, useMockData = false) {
  const [state, setState] = useState<CalendarState>({
    events: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchEvents = async () => {
      // Use mock data for development/demo
      if (useMockData) {
        setState({
          events: getMockEvents(startDate),
          loading: false,
          error: null,
        });
        return;
      }

      // Fetch real data from API
      setState(prev => ({ ...prev, loading: true, error: null }));

      try {
        const events = await calendarAPI.getEvents(startDate, endDate);
        
        // Parse date strings back to Date objects if needed
        const parsedEvents = events.map(event => ({
          ...event,
          start: new Date(event.start),
          end: new Date(event.end),
        }));

        setState({
          events: parsedEvents,
          loading: false,
          error: null,
        });
      } catch (error) {
        console.error('Failed to fetch calendar events:', error);
        
        // Fallback to mock data on error
        setState({
          events: getMockEvents(startDate),
          loading: false,
          error: 'Using demo events. Connect Google Calendar to see real events.',
        });
      }
    };

    fetchEvents();
  }, [startDate, endDate, useMockData]);

  const refetch = async () => {
    setState(prev => ({ ...prev, loading: true }));
    
    try {
      const events = await calendarAPI.getEvents(startDate, endDate);
      const parsedEvents = events.map(event => ({
        ...event,
        start: new Date(event.start),
        end: new Date(event.end),
      }));

      setState({
        events: parsedEvents,
        loading: false,
        error: null,
      });
    } catch (error) {
      console.error('Failed to refetch calendar events:', error);
      setState(prev => ({
        ...prev,
        loading: false,
        error: 'Failed to refresh events.',
      }));
    }
  };

  return { ...state, refetch };
}