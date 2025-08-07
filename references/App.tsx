import React, { useState } from 'react';
import WelcomeScreen from './components/WelcomeScreen';
import ChatScreen from './components/ChatScreen';
import ResultScreen from './components/ResultScreen';

export type Message = {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
};

export type AppState = 'welcome' | 'chat' | 'reveal' | 'result';

export default function App() {
  const [currentState, setCurrentState] = useState<AppState>('welcome');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isRevealed, setIsRevealed] = useState(false);

  const startChat = (initialMessage: string) => {
    const userMessage: Message = {
      id: '1',
      text: initialMessage,
      isUser: true,
      timestamp: new Date(),
    };
    
    const kinokoResponse: Message = {
      id: '2',
      text: 'そうですね...その気持ち、とてもよく分かります。まず、その悩みについて少し詳しく聞かせていただけませんか？なぜそのように感じるようになったのでしょうか？',
      isUser: false,
      timestamp: new Date(),
    };

    setMessages([userMessage, kinokoResponse]);
    setCurrentState('chat');
  };

  const addMessage = (message: Message) => {
    setMessages(prev => [...prev, message]);
  };

  const triggerReveal = () => {
    setIsRevealed(true);
    setCurrentState('reveal');
    
    const revealMessage: Message = {
      id: `reveal-${Date.now()}`,
      text: '実は...私、IT研修講師をしているんです。これまでお話しを聞かせていただいて、あなたの思考を「デバッグ」するお手伝いができそうです。技術的な視点から、新しいフレームワークを提案させていただきますね。',
      isUser: false,
      timestamp: new Date(),
    };
    
    addMessage(revealMessage);
  };

  const showResult = () => {
    setCurrentState('result');
  };

  const resetApp = () => {
    setCurrentState('welcome');
    setMessages([]);
    setIsRevealed(false);
  };

  if (currentState === 'welcome') {
    return <WelcomeScreen onStart={startChat} />;
  }

  if (currentState === 'result') {
    return <ResultScreen messages={messages} onRestart={resetApp} />;
  }

  return (
    <ChatScreen 
      messages={messages}
      isRevealed={isRevealed}
      onAddMessage={addMessage}
      onReveal={triggerReveal}
      onShowResult={showResult}
      currentState={currentState}
    />
  );
}