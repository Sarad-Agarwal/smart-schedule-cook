
import { Moon, Sun, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';
import { useCalendar } from '@/contexts/CalendarContext';

export const Header = () => {
  const { isDark, toggleTheme } = useTheme();
  const { isAuthenticated, authenticate } = useCalendar();

  return (
    <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Calendar className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
          <span className="text-xl font-bold text-gray-900 dark:text-white">
            Smart Scheduler
          </span>
        </div>
        
        <div className="flex items-center space-x-4">
          {!isAuthenticated && (
            <Button
              onClick={authenticate}
              variant="outline"
              size="sm"
              className="text-indigo-600 border-indigo-600 hover:bg-indigo-50 dark:text-indigo-400 dark:border-indigo-400 dark:hover:bg-indigo-900/20"
            >
              Connect Calendar
            </Button>
          )}
          
          <Button
            onClick={toggleTheme}
            variant="ghost"
            size="icon"
            className="rounded-full"
          >
            {isDark ? (
              <Sun className="h-5 w-5 text-yellow-500" />
            ) : (
              <Moon className="h-5 w-5 text-gray-600" />
            )}
          </Button>
        </div>
      </div>
    </header>
  );
};
