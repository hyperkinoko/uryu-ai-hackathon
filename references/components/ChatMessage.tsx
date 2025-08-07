import React from 'react';
import { Message } from '../App';

interface ChatMessageProps {
  message: Message;
  isRevealed: boolean;
}

export default function ChatMessage({ message, isRevealed }: ChatMessageProps) {
  if (message.isUser) {
    return (
      <div className="flex justify-end mb-3">
        <div className={`max-w-xs px-4 py-3 rounded-3xl transition-all duration-1000 shadow-lg ${
          isRevealed 
            ? 'bg-green-600 text-black border border-green-400/30 font-mono' 
            : 'bg-green-500 text-white'
        }`}
        style={isRevealed ? { 
          textShadow: '0 0 5px rgba(34, 197, 94, 0.3)',
          boxShadow: '0 0 15px rgba(34, 197, 94, 0.3)'
        } : {}}>
          <p className="text-sm leading-relaxed">{message.text}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-start mb-3">
      <div className={`max-w-xs px-4 py-3 rounded-3xl transition-all duration-1000 shadow-lg ${
        isRevealed 
          ? 'bg-black/70 text-green-400 border border-green-400/30 font-mono backdrop-blur-sm' 
          : 'bg-white/90 text-gray-800 border border-gray-200'
      }`}
      style={isRevealed ? { 
        textShadow: '0 0 5px rgba(34, 197, 94, 0.5)',
        boxShadow: '0 0 15px rgba(34, 197, 94, 0.2)'
      } : {}}>
        <p className="text-sm leading-relaxed">{message.text}</p>
      </div>
    </div>
  );
}