import React from 'react';
import { Message } from '../App';

interface ChatMessageProps {
  message: Message;
  isRevealed: boolean;
}

export default function ChatMessage({ message, isRevealed }: ChatMessageProps) {
  if (message.isUser) {
    return (
      <div className="flex justify-end">
        <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
          isRevealed 
            ? 'bg-blue-600 text-white' 
            : 'bg-purple-600 text-white'
        }`}>
          <p className="text-sm">{message.text}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start space-x-3">
      <div className="flex-shrink-0">
        <img 
          src={isRevealed ? '/images/edita.png' : '/images/kinoko.png'}
          alt={isRevealed ? 'エディ太' : 'きのこ先生'}
          className="w-8 h-8 rounded-full object-cover"
        />
      </div>
      <div className="flex-1">
        <div className={`inline-block px-4 py-2 rounded-lg max-w-xs lg:max-w-md ${
          isRevealed 
            ? 'bg-slate-700 text-white' 
            : 'bg-white/80 text-gray-800'
        }`}>
          <p className="text-sm">{message.text}</p>
        </div>
        <p className={`text-xs mt-1 ${
          isRevealed ? 'text-gray-400' : 'text-gray-500'
        }`}>
          {message.timestamp.toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </p>
      </div>
    </div>
  );
}