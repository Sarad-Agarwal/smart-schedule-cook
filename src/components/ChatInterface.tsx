
import { useState, useRef, useEffect } from 'react';
import { MessageBubble } from './MessageBubble';
import { ChatInput } from './ChatInput';
import { TypingIndicator } from './TypingIndicator';
import { WelcomeMessage } from './WelcomeMessage';

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  type?: 'text' | 'suggestion' | 'confirmation';
}

export const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

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

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = generateAIResponse(text);
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

  const generateAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('schedule') || lowerMessage.includes('book') || lowerMessage.includes('meeting')) {
      return "I'd be happy to help you schedule that! Could you tell me more details like the date, time preference, and duration you have in mind? 📅";
    }
    
    if (lowerMessage.includes('cook') || lowerMessage.includes('lunch') || lowerMessage.includes('kitchen')) {
      return "Perfect! I understand you need to work around your cooking schedule. 👩‍🍳 When are you planning to cook lunch, and would you prefer to schedule before or after? I can suggest time slots that give you enough buffer time.";
    }
    
    if (lowerMessage.includes('tomorrow') || lowerMessage.includes('today') || lowerMessage.includes('next week')) {
      return "Got it! Let me check your calendar availability for that timeframe. What duration are you thinking - 30 minutes, 1 hour, or something else?";
    }
    
    return "I'm here to help you schedule your appointments! You can ask me things like 'Schedule a meeting tomorrow afternoon' or 'Find time after I cook lunch'. What would you like to schedule? ✨";
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
