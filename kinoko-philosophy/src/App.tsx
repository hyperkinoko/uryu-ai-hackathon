import { useState } from 'react';
import WelcomeScreen from './components/WelcomeScreen';
import ChatScreen from './components/ChatScreen';
import ResultScreen from './components/ResultScreen';
import { callClaude, ChatMessage as APIChatMessage } from './lib/api';

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

  const startChat = async (initialMessage: string) => {
    const userMessage: Message = {
      id: '1',
      text: initialMessage,
      isUser: true,
      timestamp: new Date(),
    };
    
    setMessages([userMessage]);
    setCurrentState('chat');

    try {
      const response = await callClaude([{
        role: 'user',
        content: initialMessage
      }], 'philosophy');
      
      const kinokoResponse: Message = {
        id: '2',
        text: response,
        isUser: false,
        timestamp: new Date(),
      };

      setMessages([userMessage, kinokoResponse]);
    } catch (error) {
      console.error('Error starting chat:', error);
      const errorResponse: Message = {
        id: '2',
        text: 'こんにちは。お話を聞かせてください。どのようなことでお悩みですか？',
        isUser: false,
        timestamp: new Date(),
      };
      setMessages([userMessage, errorResponse]);
    }
  };

  const addMessage = (message: Message) => {
    setMessages(prev => [...prev, message]);
  };

  const triggerReveal = async () => {
    setIsRevealed(true);
    setCurrentState('reveal');
    
    // まず種明かしメッセージを即座に表示
    const revealMessage: Message = {
      id: `reveal-${Date.now()}`,
      text: '実は...私、IT研修講師をしているんです。これまでお話しを聞かせていただいて、あなたの思考を「デバッグ」するお手伝いができそうです。技術的な視点から、新しいフレームワークを提案させていただきますね。',
      isUser: false,
      timestamp: new Date(),
    };
    
    addMessage(revealMessage);
    
    // その後、APIを使って追加のメッセージを生成（エラー時はスキップ）
    setTimeout(async () => {
      try {
        const apiMessages: APIChatMessage[] = messages
          .filter(m => !m.id.includes('reveal'))
          .map(m => ({
            role: m.isUser ? 'user' : 'assistant',
            content: m.text
          }));

        const response = await callClaude(apiMessages, 'reveal');
        
        const additionalMessage: Message = {
          id: `reveal-additional-${Date.now()}`,
          text: response,
          isUser: false,
          timestamp: new Date(),
        };
        
        addMessage(additionalMessage);
      } catch (error) {
        console.error('Error generating additional reveal message:', error);
        // エラー時は追加メッセージは表示しない
      }
    }, 1000);
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