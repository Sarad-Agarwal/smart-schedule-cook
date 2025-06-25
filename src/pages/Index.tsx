
import { useState } from 'react';
import { ChatInterface } from '@/components/ChatInterface';
import { CalendarProvider } from '@/contexts/CalendarContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { Header } from '@/components/Header';

const Index = () => {
  return (
    <ThemeProvider>
      <CalendarProvider>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
          <Header />
          <main className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                  Smart Scheduler AI
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-2">
                  Your conversational appointment booking assistant
                </p>
                <p className="text-sm text-indigo-600 dark:text-indigo-400 font-medium">
                  🧑‍🍳 Cook-friendly scheduling • 📅 Google Calendar integration
                </p>
              </div>
              <ChatInterface />
            </div>
          </main>
        </div>
      </CalendarProvider>
    </ThemeProvider>
  );
};

export default Index;
