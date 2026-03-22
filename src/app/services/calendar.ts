// Calendar service for managing events

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  location?: string;
  calendarType: string;
  isVirtual: boolean;
  dressCode?: string;
  weather?: {
    temperature: number;
    condition: string;
    icon: string;
  };
}

// Mock calendar events
export async function getCalendarEvents(date: Date = new Date()): Promise<CalendarEvent[]> {
  await new Promise(resolve => setTimeout(resolve, 200));

  const today = new Date(date);
  today.setHours(0, 0, 0, 0);

  const events: CalendarEvent[] = [
    {
      id: '1',
      title: 'Team Meeting',
      description: 'Quarterly planning session',
      startTime: new Date(today.getTime() + 15.5 * 60 * 60 * 1000), // 3:30 PM
      endTime: new Date(today.getTime() + 17 * 60 * 60 * 1000), // 5:00 PM
      location: 'Conference Room B',
      calendarType: 'Work',
      isVirtual: false,
      dressCode: 'Business casual - Light blazer with chinos and loafers for a professional yet comfortable look in mild weather.'
    }
  ];

  // Add events for tomorrow
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  events.push({
    id: '2',
    title: 'Introduction to Anthropology (ANTH 1010)',
    description: 'University lecture',
    startTime: new Date(tomorrow.getTime() + 9.5 * 60 * 60 * 1000), // 9:30 AM
    endTime: new Date(tomorrow.getTime() + 10.75 * 60 * 60 * 1000), // 10:45 AM
    location: 'Monroe Hall, Charlottesville, VA 22903, USA',
    calendarType: 'School',
    isVirtual: false,
    dressCode: 'Casual - Lightweight chinos or tailored shorts with a breathable cotton t-shirt or polo. Comfortable sneakers recommended.'
  });

  events.push({
    id: '3',
    title: 'Intro Physics 1 for Engineers (PHYS 1425)',
    description: 'Engineering class',
    startTime: new Date(tomorrow.getTime() + 12.5 * 60 * 60 * 1000), // 12:30 PM
    endTime: new Date(tomorrow.getTime() + 13.75 * 60 * 60 * 1000), // 1:45 PM
    location: 'Physics Building, Room 205',
    calendarType: 'School',
    isVirtual: false,
    dressCode: 'Casual - Comfortable jeans and a t-shirt. Bring a light jacket as labs can be cool.'
  });

  events.push({
    id: '4',
    title: 'Coffee with Sarah',
    description: 'Catch up meeting',
    startTime: new Date(tomorrow.getTime() + 15 * 60 * 60 * 1000), // 3:00 PM
    endTime: new Date(tomorrow.getTime() + 16 * 60 * 60 * 1000), // 4:00 PM
    location: 'Starbucks Downtown',
    calendarType: 'Personal',
    isVirtual: false,
    dressCode: 'Smart casual - Nice jeans with a fitted top and casual sneakers or ankle boots.'
  });

  return events.sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
}

// Get upcoming events from now
export async function getUpcomingEvents(): Promise<CalendarEvent[]> {
  const allEvents = await getCalendarEvents();
  const now = new Date();
  return allEvents.filter(event => event.startTime > now);
}

// Get the most important upcoming event
export async function getNextImportantEvent(): Promise<CalendarEvent | null> {
  const upcoming = await getUpcomingEvents();
  return upcoming.length > 0 ? upcoming[0] : null;
}

// Get events for a specific date
export async function getEventsForDate(date: Date): Promise<CalendarEvent[]> {
  const allEvents = await getCalendarEvents();
  const targetDate = new Date(date);
  targetDate.setHours(0, 0, 0, 0);
  
  return allEvents.filter(event => {
    const eventDate = new Date(event.startTime);
    eventDate.setHours(0, 0, 0, 0);
    return eventDate.getTime() === targetDate.getTime();
  });
}

// Synchronous mock data for immediate use
export const mockCalendarEvents: CalendarEvent[] = (() => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const events: CalendarEvent[] = [
    {
      id: '1',
      title: 'Team Meeting',
      description: 'Quarterly planning session',
      startTime: new Date(today.getTime() + 15.5 * 60 * 60 * 1000), // 3:30 PM
      endTime: new Date(today.getTime() + 17 * 60 * 60 * 1000), // 5:00 PM
      location: 'Conference Room B',
      calendarType: 'Work',
      isVirtual: false,
      dressCode: 'Business casual - Light blazer with chinos and loafers for a professional yet comfortable look in mild weather.'
    }
  ];

  // Add events for tomorrow
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  events.push({
    id: '2',
    title: 'Introduction to Anthropology (ANTH 1010)',
    description: 'University lecture',
    startTime: new Date(tomorrow.getTime() + 9.5 * 60 * 60 * 1000), // 9:30 AM
    endTime: new Date(tomorrow.getTime() + 10.75 * 60 * 60 * 1000), // 10:45 AM
    location: 'Monroe Hall, Charlottesville, VA 22903, USA',
    calendarType: 'School',
    isVirtual: false,
    dressCode: 'Casual - Lightweight chinos or tailored shorts with a breathable cotton t-shirt or polo. Comfortable sneakers recommended.'
  });

  events.push({
    id: '3',
    title: 'Intro Physics 1 for Engineers (PHYS 1425)',
    description: 'Engineering class',
    startTime: new Date(tomorrow.getTime() + 12.5 * 60 * 60 * 1000), // 12:30 PM
    endTime: new Date(tomorrow.getTime() + 13.75 * 60 * 60 * 1000), // 1:45 PM
    location: 'Physics Building, Room 205',
    calendarType: 'School',
    isVirtual: false,
    dressCode: 'Casual - Comfortable jeans and a t-shirt. Bring a light jacket as labs can be cool.'
  });

  events.push({
    id: '4',
    title: 'Coffee with Sarah',
    description: 'Catch up meeting',
    startTime: new Date(tomorrow.getTime() + 15 * 60 * 60 * 1000), // 3:00 PM
    endTime: new Date(tomorrow.getTime() + 16 * 60 * 60 * 1000), // 4:00 PM
    location: 'Starbucks Downtown',
    calendarType: 'Personal',
    isVirtual: false,
    dressCode: 'Smart casual - Nice jeans with a fitted top and casual sneakers or ankle boots.'
  });

  return events.sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
})();