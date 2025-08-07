import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Menu, Settings } from 'lucide-react';
import kinokoImage from 'figma:asset/c6d4f4239937d25c0694f862a67e6b8dc3cbb1e0.png';

interface WelcomeScreenProps {
  onStart: (message: string) => void;
}

export default function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  const [userInput, setUserInput] = useState('');

  const handleStart = () => {
    if (userInput.trim()) {
      onStart(userInput.trim());
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && userInput.trim()) {
      handleStart();
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* 美しい背景グラデーション */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-200 via-purple-100 to-green-100">
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-100/30 via-transparent to-blue-200/20"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-green-200/40 via-transparent to-transparent"></div>
      </div>

      {/* 雲のような装飾 */}
      <div className="absolute top-10 left-10 w-32 h-16 bg-white/40 rounded-full blur-xl"></div>
      <div className="absolute top-20 right-20 w-40 h-20 bg-white/30 rounded-full blur-xl"></div>
      <div className="absolute top-32 left-1/3 w-24 h-12 bg-white/50 rounded-full blur-lg"></div>

      {/* ヘッダー */}
      <div className="relative z-10 flex justify-between items-center p-6">
        <Button variant="ghost" size="icon" className="text-gray-700 bg-white/20 hover:bg-white/30 backdrop-blur-sm">
          <Menu className="w-5 h-5" />
        </Button>
        <Button variant="ghost" size="icon" className="text-gray-700 bg-white/20 hover:bg-white/30 backdrop-blur-sm">
          <Settings className="w-5 h-5" />
        </Button>
      </div>

      {/* メインコンテンツ */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-200px)] px-6">
        {/* きのこ先生のキャラクター - 大きく中央配置 */}
        <div className="mb-8">
          <div className="relative">
            <img 
              src={kinokoImage} 
              alt="きのこ先生" 
              className="w-80 h-80 object-contain drop-shadow-2xl"
            />
            {/* オンライン状態インジケーター */}
            <div className="absolute bottom-8 right-8 w-8 h-8 bg-green-500 rounded-full border-4 border-white shadow-lg animate-pulse"></div>
          </div>
        </div>

        {/* タイトル */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2 drop-shadow-sm">
            きのこ先生
          </h1>
          <p className="text-lg text-gray-600 drop-shadow-sm">
            あなたの思考をデバッグします
          </p>
        </div>
      </div>

      {/* 下部の入力エリア */}
      <div className="absolute bottom-0 left-0 right-0 z-10 p-6">
        <div className="max-w-md mx-auto">
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-4 shadow-xl border border-white/20">
            <div className="flex items-center space-x-3">
              <Input
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="何でも聞いて"
                className="flex-1 bg-transparent border-0 text-gray-800 placeholder-gray-500 focus:ring-0 focus:outline-none text-base"
              />
              {userInput.trim() && (
                <Button 
                  onClick={handleStart}
                  size="sm"
                  className="bg-blue-500 hover:bg-blue-600 text-white rounded-xl px-4 py-2 shadow-md"
                >
                  送信
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* ページインジケーター */}
        <div className="flex justify-center mt-4">
          <div className="w-32 h-1 bg-white/40 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}