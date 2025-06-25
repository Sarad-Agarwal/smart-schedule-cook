
import { useState, useRef, useEffect } from 'react';
import { MessageBubble } from './MessageBubble';
import { ChatInput } from './ChatInput';
import { TypingIndicator } from './TypingIndicator';
import { WelcomeMessage } from './WelcomeMessage';
import { useCalendar } from '@/contexts/CalendarContext';
import { useToast } from '@/hooks/use-toast';

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  type?: 'text' | 'suggestion' | 'confirmation';
}

interface BookingState {
  title?: string;
  date?: string;
  time?: string;
  duration?: number;
  confirmed?: boolean;
}

export const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [bookingState, setBookingState] = useState<BookingState>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { createEvent, getAvailability, isAuthenticated } = useCalendar();
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async (text: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);
    setIsTyping(true);

    // Simulate AI response with booking logic
    setTimeout(async () => {
      const aiResponse = await generateAIResponse(text);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        sender: 'ai',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const parseDateTime = (text: string) => {
    const now = new Date();
    const lowerText = text.toLowerCase();
    
    // Parse date
    let targetDate = new Date();
    if (lowerText.includes('tomorrow')) {
      targetDate.setDate(now.getDate() + 1);
    } else if (lowerText.includes('next week')) {
      targetDate.setDate(now.getDate() + 7);
    } else if (lowerText.includes('today')) {
      targetDate = new Date();
    }

    // Parse time
    const timeMatch = text.match(/(\d{1,2}):?(\d{0,2})\s*(am|pm|AM|PM)?/);
    let hour = 14; // default 2 PM
    let minute = 0;
    
    if (timeMatch) {
      hour = parseInt(timeMatch[1]);
      minute = timeMatch[2] ? parseInt(timeMatch[2]) : 0;
      if (timeMatch[3] && timeMatch[3].toLowerCase() === 'pm' && hour < 12) {
        hour += 12;
      } else if (timeMatch[3] && timeMatch[3].toLowerCase() === 'am' && hour === 12) {
        hour = 0;
      }
    }

    targetDate.setHours(hour, minute, 0, 0);
    return targetDate;
  };

  const generateAIResponse = async (userMessage: string): Promise<string> => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Check if user wants to confirm booking
    if (lowerMessage.includes('yes') || lowerMessage.includes('confirm') || lowerMessage.includes('book it')) {
      if (bookingState.title && bookingState.date && bookingState.time) {
        try {
          const startDate = new Date(`${bookingState.date}T${bookingState.time}`);
          const endDate = new Date(startDate.getTime() + (bookingState.duration || 30) * 60000);
          
          await createEvent({
            title: bookingState.title,
            start: startDate.toISOString(),
            end: endDate.toISOString(),
            description: `Scheduled via Smart Scheduler AI`
          });

          setBookingState({});
          
          toast({
            title: "✅ Event Booked!",
            description: `${bookingState.title} scheduled for ${startDate.toLocaleString()}. You'll get a notification!`,
          });

          return `Perfect! 🎉 I've successfully booked "${bookingState.title}" for ${startDate.toLocaleDateString()} at ${startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}. 

You'll receive:
📱 A browser notification when it's time
📧 Email reminders (if Google Calendar is connected)
🔔 A popup reminder 10 minutes before

The event has been added to your calendar! Is there anything else you'd like to schedule?`;
        } catch (error) {
          console.error('Booking failed:', error);
          return "I apologize, but there was an issue booking your appointment. Please try again or check your calendar connection.";
        }
      }
    }
    
    // Extract booking information
    if (lowerMessage.includes('schedule') || lowerMessage.includes('book') || lowerMessage.includes('meeting')) {
      const dateTime = parseDateTime(userMessage);
      const titleMatch = userMessage.match(/(meeting|call|appointment|session)\s+(?:with\s+)?([^,.\n]+)/i);
      const title = titleMatch ? titleMatch[0] : 'Meeting';
      
      // Update booking state
      const newBookingState = {
        title: title,
        date: dateTime.toISOString().split('T')[0],
        time: dateTime.toTimeString().split(' ')[0].substring(0, 5),
        duration: 30 // default 30 minutes
      };
      setBookingState(newBookingState);

      if (!isAuthenticated) {
        return `I'd love to help you schedule that! However, I need you to connect your Google Calendar first. Please click the "Connect Calendar" button in the header to authenticate. 

Once connected, I can:
✅ Check your real availability
✅ Book directly to your calendar
✅ Set up automatic reminders
🔔 Create system notifications

After connecting, just ask me again to schedule your "${title}"!`;
      }

      return `Great! I'd like to schedule "${title}" for ${dateTime.toLocaleDateString()} at ${dateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}.

📅 **Booking Summary:**
- **Event**: ${title}
- **Date**: ${dateTime.toLocaleDateString()}
- **Time**: ${dateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
- **Duration**: 30 minutes
- **Reminders**: Browser notification + Email (10 min before)

Should I confirm and book this appointment? Just say "Yes" or "Confirm" to proceed! 🚀`;
    }
    
    // Handle cook-related scheduling
    if (lowerMessage.includes('cook') || lowerMessage.includes('lunch') || lowerMessage.includes('kitchen')) {
      const dateTime = parseDateTime(userMessage);
      
      setBookingState({
        title: 'Meeting (after cooking)',
        date: dateTime.toISOString().split('T')[0],
        time: dateTime.toTimeString().split(' ')[0].substring(0, 5),
        duration: 30
      });

      return `Perfect! I understand you need to work around your cooking schedule. 👩‍🍳 

I can schedule your meeting for ${dateTime.toLocaleDateString()} at ${dateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} (giving you time to cook first).

This will include:
🔔 A system alarm/notification
📱 Browser popup reminder
⏰ Buffer time for your cooking

Would you like me to book this? Just say "Yes" to confirm! 

*Cook for Calendar mode activated - I understand homemaker scheduling needs!* 🏠`;
    }
    
    // Handle time-based requests
    if (lowerMessage.includes('tomorrow') || lowerMessage.includes('today') || lowerMessage.includes('next week')) {
      const dateTime = parseDateTime(userMessage);
      
      return `I can help you find time ${lowerMessage.includes('tomorrow') ? 'tomorrow' : lowerMessage.includes('today') ? 'today' : 'next week'}! 

Here are some available slots around ${dateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}:
• ${dateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
• ${new Date(dateTime.getTime() + 3600000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
• ${new Date(dateTime.getTime() + 7200000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}

What would you like to schedule? Please tell me more details like:
- Meeting type (call, appointment, etc.)
- Duration needed
- Any specific preferences

I'll create an alarm that will ring on your system! ⏰`;
    }
    
    return `I'm here to help you schedule appointments with system alarms! 🚀 

You can ask me things like:
📅 "Schedule a meeting tomorrow at 2 PM"
🧑‍🍳 "Book a call after I cook lunch"
⏰ "Find time this Friday afternoon"
🔔 "Set up a meeting with an alarm for next week"

I'll create browser notifications and alarms that will ring at the right time! What would you like to schedule? ✨`;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden h-[600px] flex flex-col">
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.length === 0 ? (
          <WelcomeMessage onQuickAction={handleSendMessage} />
        ) : (
          messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))
        )}
        
        {isTyping && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="border-t border-gray-200 dark:border-gray-700 p-4">
        <ChatInput onSendMessage={handleSendMessage} />
      </div>
    </div>
  );
};
