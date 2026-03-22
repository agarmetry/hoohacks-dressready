import { useState, useEffect, useCallback, useRef } from 'react';
import type { CalendarEvent } from '../app/data/mockData';

export type NotificationTiming = '1hour' | '30min' | '15min' | '5min';

interface NotificationSettings {
  enabled: boolean;
  timings: NotificationTiming[];
  notifyHeroEvent: boolean;
  notifyNextEvent: boolean;
}

const DEFAULT_SETTINGS: NotificationSettings = {
  enabled: true,
  timings: ['1hour', '15min'],
  notifyHeroEvent: true,
  notifyNextEvent: true,
};

const TIMING_MINUTES: Record<NotificationTiming, number> = {
  '1hour': 60,
  '30min': 30,
  '15min': 15,
  '5min': 5,
};

export function useNotifications() {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [settings, setSettings] = useState<NotificationSettings>(() => {
    const saved = localStorage.getItem('dressready_notification_settings');
    return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
  });
  
  // Use ref instead of state to avoid infinite loops
  const scheduledNotificationsRef = useRef<number[]>([]);

  // Check notification permission on mount
  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  // Save settings to localStorage when they change
  useEffect(() => {
    localStorage.setItem('dressready_notification_settings', JSON.stringify(settings));
  }, [settings]);

  // Request notification permission
  const requestPermission = useCallback(async () => {
    if (!('Notification' in window)) {
      alert('This browser does not support desktop notifications');
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    const result = await Notification.requestPermission();
    setPermission(result);
    return result === 'granted';
  }, []);

  // Send a notification
  const sendNotification = useCallback((title: string, options?: NotificationOptions) => {
    if (Notification.permission !== 'granted') {
      return null;
    }

    const notification = new Notification(title, {
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      ...options,
    });

    // Focus app when notification is clicked
    notification.onclick = () => {
      window.focus();
      notification.close();
    };

    return notification;
  }, []);

  // Schedule notifications for an event
  const scheduleEventNotifications = useCallback((event: CalendarEvent, isHero: boolean = false) => {
    if (!settings.enabled || Notification.permission !== 'granted') {
      return;
    }

    // Only notify for hero event if enabled
    if (isHero && !settings.notifyHeroEvent) {
      return;
    }

    // Only notify for next event if enabled  
    if (!isHero && !settings.notifyNextEvent) {
      return;
    }

    const now = new Date();
    const eventTime = new Date(event.start);
    const timeDiff = eventTime.getTime() - now.getTime();

    // Clear any previously scheduled notifications for this event
    clearScheduledNotifications();

    const newTimeouts: number[] = [];

    // Schedule notifications based on timing settings
    settings.timings.forEach((timing) => {
      const minutesBefore = TIMING_MINUTES[timing];
      const notifyTime = timeDiff - (minutesBefore * 60 * 1000);

      // Only schedule if the notification time hasn't passed
      if (notifyTime > 0) {
        const timeoutId = window.setTimeout(() => {
          const emoji = isHero ? '⭐' : '📅';
          const prefix = isHero ? 'Important Event' : 'Upcoming Event';
          
          sendNotification(`${emoji} ${prefix} in ${minutesBefore} min`, {
            body: `${event.title}\n${event.dressCode} • ${event.forecastSummary}\n\n${event.recommendation}`,
            tag: `event-${event.id}-${timing}`,
            requireInteraction: false,
            silent: false,
          });
        }, notifyTime);

        newTimeouts.push(timeoutId);
      }
    });

    scheduledNotificationsRef.current = [...scheduledNotificationsRef.current, ...newTimeouts];
  }, [settings, sendNotification]);

  // Clear all scheduled notifications
  const clearScheduledNotifications = useCallback(() => {
    scheduledNotificationsRef.current.forEach(timeoutId => {
      window.clearTimeout(timeoutId);
    });
    scheduledNotificationsRef.current = [];
  }, []);

  // Update settings
  const updateSettings = useCallback((newSettings: Partial<NotificationSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  }, []);

  // Test notification
  const sendTestNotification = useCallback(() => {
    sendNotification('🎉 DressReady Notifications Enabled!', {
      body: 'You\'ll receive reminders before your important events.',
      tag: 'test-notification',
    });
  }, [sendNotification]);

  return {
    permission,
    settings,
    requestPermission,
    sendNotification,
    scheduleEventNotifications,
    clearScheduledNotifications,
    updateSettings,
    sendTestNotification,
  };
}