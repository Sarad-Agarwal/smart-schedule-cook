
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
}

const CalendarContext = createContext<CalendarContextType | undefined>(undefined);

export const CalendarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [events, setEvents] = useState<CalendarEvent[]>([]);

  const authenticate = async () => {
    // TODO: Implement Google OAuth2 authentication
    console.log('Authenticating with Google Calendar...');
    setIsAuthenticated(true);
  };

  const createEvent = async (event: Omit<CalendarEvent, 'id'>) => {
    // TODO: Implement Google Calendar event creation
    const newEvent = { ...event, id: Date.now().toString() };
    setEvents(prev => [...prev, newEvent]);
    console.log('Created event:', newEvent);
  };

  const getAvailability = async (date: string): Promise<string[]> => {
    // TODO: Implement availability checking
    console.log('Checking availability for:', date);
    return ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'];
  };

  return (
    <CalendarContext.Provider value={{
      isAuthenticated,
      events,
      authenticate,
      createEvent,
      getAvailability
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
