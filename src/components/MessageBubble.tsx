
import { Message } from './ChatInterface';
import { User, Bot, Clock } from 'lucide-react';

interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble = ({ message }: MessageBubbleProps) => {
  const isUser = message.sender === 'user';
  
  return (
    <div className={`flex items-start space-x-3 ${isUser ? 'flex-row-reverse space-x-reverse' : ''} animate-fade-in`}>
      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
        isUser 
          ? 'bg-indigo-600 text-white' 
          : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
      }`}>
        {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
      </div>
      
      <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-[70%]`}>
        <div className={`px-4 py-3 rounded-2xl shadow-sm ${
          isUser 
            ? 'bg-indigo-600 text-white rounded-br-md' 
            : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-bl-md'
        }`}>
          <p className="text-sm leading-relaxed">{message.text}</p>
        </div>
        
        <div className="flex items-center space-x-1 mt-1 text-xs text-gray-500 dark:text-gray-400">
          <Clock className="w-3 h-3" />
          <span>{message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
      </div>
    </div>
  );
};
