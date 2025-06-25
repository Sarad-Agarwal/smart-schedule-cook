
import React, { createContext, useContext, useState } from 'react';

interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  description?: string;
}

interface CalendarContextType {
  isAuthenticated: boolean;
  events: CalendarEvent[];
  authenticate: () => Promise<void>;
  createEvent: (event: Omit<CalendarEvent, 'id'>) => Promise<void>;
  getAvailability: (date: string) => Promise<string[]>;
  createAlarm: (title: string, dateTime: string) => Promise<void>;
}

const CalendarContext = createContext<CalendarContextType | undefined>(undefined);

// Google Calendar API configuration
const GOOGLE_CLIENT_ID = 'your-google-client-id'; // You'll need to set this
const GOOGLE_API_KEY = 'your-google-api-key'; // You'll need to set this
const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest';
const SCOPES = 'https://www.googleapis.com/auth/calendar';

export const CalendarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [gapi, setGapi] = useState<any>(null);

  const initializeGapi = async () => {
    if (!window.gapi) {
      console.log('Google API not loaded, using mock implementation');
      return null;
    }

    await window.gapi.load('client:auth2', async () => {
      await window.gapi.client.init({
        apiKey: GOOGLE_API_KEY,
        clientId: GOOGLE_CLIENT_ID,
        discoveryDocs: [DISCOVERY_DOC],
        scope: SCOPES
      });
      setGapi(window.gapi);
    });
    return window.gapi;
  };

  const authenticate = async () => {
    try {
      const gapiInstance = await initializeGapi();
      
      if (!gapiInstance) {
        // Mock authentication for demo
        console.log('Mock: Authenticating with Google Calendar...');
        setTimeout(() => setIsAuthenticated(true), 1000);
        return;
      }

      const authInstance = gapiInstance.auth2.getAuthInstance();
      const user = await authInstance.signIn();
      
      if (user.isSignedIn()) {
        setIsAuthenticated(true);
        console.log('Successfully authenticated with Google Calendar');
      }
    } catch (error) {
      console.error('Authentication failed:', error);
      // Fallback to mock for demo
      setIsAuthenticated(true);
    }
  };

  const createEvent = async (event: Omit<CalendarEvent, 'id'>) => {
    try {
      if (!gapi || !isAuthenticated) {
        // Mock event creation
        const newEvent = { ...event, id: Date.now().toString() };
        setEvents(prev => [...prev, newEvent]);
        console.log('Mock: Created event:', newEvent);
        
        // Create browser notification/alarm
        await createAlarm(event.title, event.start);
        return;
      }

      const request = {
        calendarId: 'primary',
        resource: {
          summary: event.title,
          description: event.description,
          start: {
            dateTime: event.start,
            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
          },
          end: {
            dateTime: event.end,
            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
          },
          reminders: {
            useDefault: false,
            overrides: [
              { method: 'popup', minutes: 10 },
              { method: 'email', minutes: 30 }
            ]
          }
        }
      };

      const response = await gapi.client.calendar.events.insert(request);
      const newEvent = { ...event, id: response.result.id };
      setEvents(prev => [...prev, newEvent]);
      
      // Create browser notification/alarm
      await createAlarm(event.title, event.start);
      
      console.log('Event created successfully:', response.result);
    } catch (error) {
      console.error('Failed to create event:', error);
    }
  };

  const createAlarm = async (title: string, dateTime: string) => {
    try {
      // Request notification permission
      if ('Notification' in window) {
        const permission = await Notification.requestPermission();
        if (permission !== 'granted') {
          console.log('Notification permission denied');
          return;
        }
      }

      const eventTime = new Date(dateTime);
      const now = new Date();
      const timeDiff = eventTime.getTime() - now.getTime();

      if (timeDiff > 0) {
        // Schedule notification
        setTimeout(() => {
          new Notification(`📅 ${title}`, {
            body: `Your scheduled event is starting now!`,
            icon: '/favicon.ico',
            badge: '/favicon.ico'
          });

          // Create audio alarm
          const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEaBDWN1fLNfS4GJG/E8N+QQgwTW7Ln66JU');
          audio.play().catch(e => console.log('Audio play failed:', e));
        }, timeDiff);

        console.log(`Alarm set for ${title} at ${eventTime.toLocaleString()}`);
      } else {
        console.log('Event time is in the past, no alarm set');
      }
    } catch (error) {
      console.error('Failed to create alarm:', error);
    }
  };

  const getAvailability = async (date: string): Promise<string[]> => {
    try {
      if (!gapi || !isAuthenticated) {
        // Mock availability
        console.log('Mock: Checking availability for:', date);
        return ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'];
      }

      const timeMin = new Date(date);
      timeMin.setHours(0, 0, 0, 0);
      const timeMax = new Date(date);
      timeMax.setHours(23, 59, 59, 999);

      const response = await gapi.client.calendar.events.list({
        calendarId: 'primary',
        timeMin: timeMin.toISOString(),
        timeMax: timeMax.toISOString(),
        singleEvents: true,
        orderBy: 'startTime'
      });

      const busySlots = response.result.items?.map((event: any) => ({
        start: new Date(event.start.dateTime).getHours(),
        end: new Date(event.end.dateTime).getHours()
      })) || [];

      // Generate available slots (9 AM to 6 PM)
      const allSlots = [];
      for (let hour = 9; hour <= 18; hour++) {
        const timeSlot = `${hour.toString().padStart(2, '0')}:00`;
        const isBusy = busySlots.some(busy => hour >= busy.start && hour < busy.end);
        if (!isBusy) {
          allSlots.push(timeSlot);
        }
      }

      return allSlots;
    } catch (error) {
      console.error('Failed to get availability:', error);
      return ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'];
    }
  };

  return (
    <CalendarContext.Provider value={{
      isAuthenticated,
      events,
      authenticate,
      createEvent,
      getAvailability,
      createAlarm
    }}>
      {children}
    </CalendarContext.Provider>
  );
};

export const useCalendar = () => {
  const context = useContext(CalendarContext);
  if (!context) {
    throw new Error('useCalendar must be used within CalendarProvider');
  }
  return context;
};
