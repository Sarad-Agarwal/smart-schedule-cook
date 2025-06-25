
import { useState } from 'react';
import { Send, Mic } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
}

export const ChatInput = ({ onSendMessage }: ChatInputProps) => {
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleVoiceInput = () => {
    setIsRecording(!isRecording);
    // TODO: Implement voice recognition
    console.log('Voice input toggle:', !isRecording);
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center space-x-2">
      <div className="flex-1 relative">
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your scheduling request... (e.g., 'Book a meeting after I cook lunch')"
          className="pr-12 rounded-full border-2 border-gray-200 dark:border-gray-600 focus:border-indigo-500 dark:focus:border-indigo-400"
        />
        
        <Button
          type="button"
          onClick={handleVoiceInput}
          variant="ghost"
          size="icon"
          className={`absolute right-1 top-1/2 -translate-y-1/2 rounded-full w-8 h-8 ${
            isRecording ? 'text-red-500 bg-red-50 dark:bg-red-900/20' : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          <Mic className={`w-4 h-4 ${isRecording ? 'animate-pulse' : ''}`} />
        </Button>
      </div>
      
      <Button
        type="submit"
        disabled={!message.trim()}
        className="rounded-full w-10 h-10 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Send className="w-4 h-4" />
      </Button>
    </form>
  );
};
