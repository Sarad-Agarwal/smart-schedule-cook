
import { Calendar, Clock, ChefHat, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface WelcomeMessageProps {
  onQuickAction: (message: string) => void;
}

export const WelcomeMessage = ({ onQuickAction }: WelcomeMessageProps) => {
  const quickActions = [
    {
      icon: Calendar,
      text: "Schedule a meeting tomorrow",
      message: "Schedule a meeting tomorrow afternoon"
    },
    {
      icon: ChefHat,
      text: "Book after cooking lunch",
      message: "I need to schedule a call after I cook lunch"
    },
    {
      icon: Clock,
      text: "Find time this week",
      message: "Find me available time slots this week"
    },
    {
      icon: Users,
      text: "Team sync meeting",
      message: "Schedule a team sync meeting for next week"
    }
  ];

  return (
    <div className="text-center py-8 animate-fade-in">
      <div className="mb-6">
        <Calendar className="w-16 h-16 text-indigo-600 dark:text-indigo-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Welcome to Smart Scheduler AI! 👋
        </h2>
        <p className="text-gray-600 dark:text-gray-300 max-w-md mx-auto">
          I'm here to help you schedule appointments naturally. Just tell me what you need, 
          and I'll handle the calendar magic! ✨
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg mx-auto mb-6">
        {quickActions.map((action, index) => (
          <Button
            key={index}
            onClick={() => onQuickAction(action.message)}
            variant="outline"
            className="flex items-center space-x-2 h-auto py-3 px-4 text-left hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:border-indigo-300 dark:hover:border-indigo-600 transition-all duration-200"
          >
            <action.icon className="w-4 h-4 text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
            <span className="text-sm">{action.text}</span>
          </Button>
        ))}
      </div>

      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 max-w-md mx-auto">
        <div className="flex items-center space-x-2 mb-2">
          <ChefHat className="w-5 h-5 text-amber-600 dark:text-amber-400" />
          <span className="font-semibold text-amber-800 dark:text-amber-200">Cook for Calendar Mode</span>
        </div>
        <p className="text-sm text-amber-700 dark:text-amber-300">
          Perfect for homemakers! I understand phrases like "after cooking dinner" or "once the kids leave for school" 🏠
        </p>
      </div>
    </div>
  );
};
