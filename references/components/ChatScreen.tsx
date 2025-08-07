import React, { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Send, Menu, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Message, AppState } from '../App';
import ChatMessage from './ChatMessage';
import kinokoImage from 'figma:asset/c6d4f4239937d25c0694f862a67e6b8dc3cbb1e0.png';
import eddiImage from 'figma:asset/53eaeb8c8d90af852399e1dfcaeeb6a051c9a4c9.png';

interface ChatScreenProps {
  messages: Message[];
  isRevealed: boolean;
  onAddMessage: (message: Message) => void;
  onReveal: () => void;
  onShowResult: () => void;
  currentState: AppState;
}

// コードスニペット
const codeSnippets = [
  'const debug = (problem) => {',
  '  return solution;',
  '};',
  'function analyze(thoughts) {',
  '  const insights = [];',
  '  return insights;',
  '}',
  'if (confused) {',
  '  askQuestions();',
  '}',
  'class MindDebugger {',
  '  constructor() {',
  '    this.clarity = 0;',
  '  }',
  '}',
  'const wisdom = await',
  '  fetchInsights();',
  'try {',
  '  solveLife();',
  '} catch (error) {',
  '  learnFromMistakes();',
  '}',
  'let growth = true;',
  'while (learning) {',
  '  improve();',
  '}',
  '// 思考をリファクタリング',
  'import { clarity }',
  '  from "wisdom";',
  'export default',
  '  breakthrough;',
  '!confusion &&',
  '  understanding++',
  'setTimeout(() => {',
  '  enlightenment();',
  '}, 1000);'
];

// コード列コンポーネント
const CodeColumn = ({ delay, columnIndex }: { delay: number; columnIndex: number }) => {
  const [codes, setCodes] = useState<Array<{ text: string; id: number; opacity: number }>>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCodes(prev => {
        const newCodes = prev
          .map(code => ({ ...code, opacity: code.opacity - 0.05 }))
          .filter(code => code.opacity > 0);
        
        // ランダムに新しいコードを追加
        if (Math.random() > 0.7) {
          const randomCode = codeSnippets[Math.floor(Math.random() * codeSnippets.length)];
          newCodes.unshift({
            text: randomCode,
            id: Date.now() + Math.random(),
            opacity: 1
          });
        }
        
        return newCodes.slice(0, 8); // 最大8行まで
      });
    }, 200 + columnIndex * 50); // 列ごとに異なる速度

    const timeoutId = setTimeout(() => {
      clearInterval(interval);
    }, 6000); // 6秒後に停止

    return () => {
      clearInterval(interval);
      clearTimeout(timeoutId);
    };
  }, [columnIndex]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: delay + columnIndex * 0.2 }}
      className="absolute top-0 w-32 h-full overflow-hidden"
      style={{ left: `${columnIndex * 12}%` }}
    >
      {codes.map((code) => (
        <motion.div
          key={code.id}
          initial={{ y: -20, opacity: 0 }}
          animate={{ 
            y: window.innerHeight + 100, 
            opacity: [0, code.opacity, code.opacity * 0.5, 0] 
          }}
          transition={{ 
            duration: 3 + Math.random() * 2,
            ease: "linear"
          }}
          className="absolute text-green-400 text-xs font-mono whitespace-nowrap"
          style={{ 
            textShadow: '0 0 10px rgba(34, 197, 94, 0.8)',
            opacity: code.opacity
          }}
        >
          {code.text}
        </motion.div>
      ))}
    </motion.div>
  );
};

export default function ChatScreen({ 
  messages, 
  isRevealed, 
  onAddMessage, 
  onReveal, 
  onShowResult,
  currentState 
}: ChatScreenProps) {
  const [inputValue, setInputValue] = useState('');
  const [showChickAnimation, setShowChickAnimation] = useState(false);
  const [showCodeRain, setShowCodeRain] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [messageCount, setMessageCount] = useState(0);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    setMessageCount(messages.filter(m => m.isUser).length);
  }, [messages]);

  // 種明かし時のアニメーション制御
  useEffect(() => {
    if (isRevealed && !showChickAnimation) {
      setShowChickAnimation(true);
      // コード雨エフェクトを少し遅らせて開始
      setTimeout(() => {
        setShowCodeRain(true);
      }, 500);
    }
  }, [isRevealed, showChickAnimation]);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      text: inputValue.trim(),
      isUser: true,
      timestamp: new Date(),
    };

    onAddMessage(userMessage);
    setInputValue('');

    // 種明かしトリガーの条件をチェック
    const triggerWords = ['解決策', 'どうすればいい', '答え', 'アドバイス', '方法'];
    const shouldReveal = triggerWords.some(word => inputValue.includes(word)) || messageCount >= 4;

    setTimeout(() => {
      if (!isRevealed && shouldReveal) {
        onReveal();
      } else if (!isRevealed) {
        // 通常の哲学的な応答
        const responses = [
          'なるほど...それは興味深い視点ですね。ソクラテスも「無知の知」について語りましたが、あなたがそのように感じるのは、むしろ成長の証かもしれません。なぜそう思われるのでしょうか？',
          'その感情の根底にあるものは何だと思いますか？古代ギリシャの哲学者エピクテトスは「我々を悩ませるのは物事そのものではなく、物事に対する我々の判断である」と言いました。',
          '面白いですね。その問題を別の角度から見てみましょう。もしあなたの親しい友人が同じ悩みを持っていたら、どのようなアドバイスをしますか？',
          'そうですね...人間の心というのは複雑なものです。カントは「人間は目的として扱われるべきであり、手段として扱われるべきではない」と言いました。あなた自身をどのように捉えていますか？',
          'その気持ち、共感できます。時として、我々は自分自身の最大の批判者になってしまいますね。では、この状況から学べることは何だと思いますか？'
        ];
        
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        const kinokoResponse: Message = {
          id: `kinoko-${Date.now()}`,
          text: randomResponse,
          isUser: false,
          timestamp: new Date(),
        };
        
        onAddMessage(kinokoResponse);
      }
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* 背景 - ダークモード切り替え */}
      <motion.div 
        className="absolute inset-0"
        animate={{
          background: isRevealed 
            ? 'linear-gradient(to bottom, rgb(17 24 39), rgb(31 41 55), rgb(55 65 81))'
            : 'linear-gradient(to bottom, rgb(191 219 254), rgb(221 214 254), rgb(187 247 208))'
        }}
        transition={{ duration: 1.5, delay: 0.5 }}
      >
        {!isRevealed && (
          <>
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-100/30 via-transparent to-blue-200/20"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-green-200/40 via-transparent to-transparent"></div>
          </>
        )}
      </motion.div>

      {/* コード雨エフェクト */}
      <AnimatePresence>
        {showCodeRain && isRevealed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 pointer-events-none z-[1]"
          >
            {/* 暗いオーバーレイ */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.8 }}
              transition={{ duration: 1.5 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-[1px]"
            />
            
            {/* コード列 */}
            {[...Array(8)].map((_, i) => (
              <CodeColumn key={i} delay={0.5} columnIndex={i} />
            ))}
            
            {/* ターミナル風テキスト */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 1 }}
              className="absolute top-20 left-6 text-green-400 font-mono text-sm"
              style={{ textShadow: '0 0 10px rgba(34, 197, 94, 0.8)' }}
            >
              <div>$ initializing debug mode...</div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
              >
                $ loading AI instructor module...
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2 }}
              >
                $ kinoko_sensei.reveal() ✓
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 雲のような装飾（通常時のみ） */}
      <AnimatePresence>
        {!isRevealed && (
          <>
            <motion.div 
              exit={{ opacity: 0 }}
              className="absolute top-10 left-10 w-32 h-16 bg-white/40 rounded-full blur-xl"
            />
            <motion.div 
              exit={{ opacity: 0 }}
              className="absolute top-20 right-20 w-40 h-20 bg-white/30 rounded-full blur-xl"
            />
            <motion.div 
              exit={{ opacity: 0 }}
              className="absolute top-32 left-1/3 w-24 h-12 bg-white/50 rounded-full blur-lg"
            />
          </>
        )}
      </AnimatePresence>

      {/* ヘッダー */}
      <div className="relative z-10 flex justify-between items-center p-6">
        <Button 
          variant="ghost" 
          size="icon" 
          className={`${isRevealed ? 'text-green-400 bg-black/20 hover:bg-black/30' : 'text-gray-700 bg-white/20 hover:bg-white/30'} backdrop-blur-sm transition-colors duration-1000`}
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <AnimatePresence>
          {isRevealed && (
            <motion.div 
              initial={{ opacity: 0, y: -20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 2.5, duration: 0.5, type: "spring", bounce: 0.4 }}
              className="bg-green-500 text-black px-4 py-2 rounded-full text-sm font-medium shadow-lg font-mono"
              style={{ textShadow: '0 0 10px rgba(34, 197, 94, 0.8)' }}
            >
              DEBUG_MODE_ACTIVE
            </motion.div>
          )}
        </AnimatePresence>
        <Button 
          variant="ghost" 
          size="icon" 
          className={`${isRevealed ? 'text-green-400 bg-black/20 hover:bg-black/30' : 'text-gray-700 bg-white/20 hover:bg-white/30'} backdrop-blur-sm transition-colors duration-1000`}
        >
          <Menu className="w-5 h-5" />
        </Button>
      </div>

      {/* キャラクター表示エリア */}
      <div className="relative z-10 flex justify-center py-8">
        <div className="relative">
          {/* メインキャラクター */}
          <motion.img 
            src={isRevealed ? eddiImage : kinokoImage}
            alt={isRevealed ? 'エディ太' : 'きのこ先生'}
            className="w-48 h-48 object-contain drop-shadow-2xl"
            animate={{ 
              scale: isRevealed ? [1, 1.1, 1] : 1,
              filter: isRevealed ? 'brightness(1.2) drop-shadow(0 0 20px rgba(34, 197, 94, 0.5))' : 'none'
            }}
            transition={{ 
              duration: isRevealed ? 0.6 : 0,
              delay: isRevealed ? 2 : 0,
              type: "spring",
              bounce: 0.3
            }}
          />

          {/* 飛んでくるひよこ（エディ太の小さいバージョン） */}
          <AnimatePresence>
            {showChickAnimation && (
              <motion.div
                initial={{ 
                  x: 400, 
                  y: -100, 
                  opacity: 0,
                  scale: 0.3,
                  rotate: -15
                }}
                animate={{ 
                  x: -60, 
                  y: 20, 
                  opacity: 1,
                  scale: 0.4,
                  rotate: [0, 5, -5, 0],
                  filter: 'brightness(1.2) drop-shadow(0 0 15px rgba(34, 197, 94, 0.7))'
                }}
                transition={{ 
                  duration: 1.5,
                  type: "spring",
                  bounce: 0.4,
                  rotate: {
                    repeat: Infinity,
                    duration: 2,
                    ease: "easeInOut"
                  }
                }}
                className="absolute top-8 left-8"
              >
                <img 
                  src={eddiImage}
                  alt="ひよこ"
                  className="w-24 h-24 object-contain drop-shadow-lg"
                />
                {/* 飛行エフェクト - エンジニア風 */}
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.7, 1, 0.7]
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 1,
                    ease: "easeInOut"
                  }}
                  className="absolute -bottom-2 -right-2 w-4 h-4 bg-green-400 rounded-full blur-sm"
                  style={{ boxShadow: '0 0 10px rgba(34, 197, 94, 0.8)' }}
                />
                <motion.div
                  animate={{
                    scale: [1.2, 1, 1.2],
                    opacity: [0.5, 0.8, 0.5]
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 1.5,
                    ease: "easeInOut"
                  }}
                  className="absolute -bottom-1 -right-1 w-3 h-3 bg-cyan-400 rounded-full blur-sm"
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* オンライン状態インジケーター */}
          <motion.div 
            className={`absolute bottom-4 right-4 w-6 h-6 rounded-full border-4 border-white shadow-lg ${
              isRevealed ? 'bg-green-500' : 'bg-green-500'
            }`}
            animate={{
              scale: isRevealed ? [1, 1.3, 1] : 1,
              backgroundColor: isRevealed ? '#22c55e' : '#10b981',
              boxShadow: isRevealed 
                ? '0 0 20px rgba(34, 197, 94, 0.8), 0 4px 8px rgba(0, 0, 0, 0.3)' 
                : '0 4px 8px rgba(0, 0, 0, 0.3)'
            }}
            transition={{ 
              duration: 0.5,
              delay: isRevealed ? 3 : 0,
              type: "spring",
              bounce: 0.4
            }}
          />

          {/* 種明かし時のキラキラエフェクト - エンジニア風 */}
          <AnimatePresence>
            {isRevealed && (
              <>
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ 
                      opacity: 0,
                      scale: 0,
                      x: 0,
                      y: 0
                    }}
                    animate={{ 
                      opacity: [0, 1, 0],
                      scale: [0, 1, 0],
                      x: Math.cos(i * 45 * Math.PI / 180) * 80,
                      y: Math.sin(i * 45 * Math.PI / 180) * 80
                    }}
                    transition={{ 
                      duration: 1.5,
                      delay: 1.5 + i * 0.1,
                      ease: "easeOut"
                    }}
                    className="absolute top-1/2 left-1/2 w-3 h-3 bg-green-400 rounded-full blur-sm"
                    style={{
                      transformOrigin: 'center',
                      boxShadow: '0 0 10px rgba(34, 197, 94, 0.8)'
                    }}
                  />
                ))}
              </>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* メッセージエリア */}
      <div className="relative z-10 flex-1 px-6 pb-32 max-h-[50vh] overflow-y-auto">
        <div className="max-w-2xl mx-auto space-y-4">
          {messages.slice(-3).map((message) => (
            <ChatMessage 
              key={message.id} 
              message={message} 
              isRevealed={isRevealed}
            />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* 種明かし後のアクションボタン */}
      {currentState === 'reveal' && (
        <div className="absolute bottom-24 left-6 right-6 z-10">
          <div className="max-w-md mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 4, duration: 0.5 }}
            >
              <Button 
                onClick={onShowResult}
                className={`w-full h-12 text-white rounded-2xl transition-all shadow-xl backdrop-blur-lg font-mono ${
                  isRevealed 
                    ? 'bg-green-600 hover:bg-green-700 border border-green-400/30' 
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
                style={isRevealed ? { 
                  textShadow: '0 0 10px rgba(34, 197, 94, 0.8)',
                  boxShadow: '0 0 20px rgba(34, 197, 94, 0.3)'
                } : {}}
              >
                $ analyze_conversation --output=visual
              </Button>
            </motion.div>
          </div>
        </div>
      )}

      {/* 入力エリア */}
      {currentState === 'chat' && (
        <div className="absolute bottom-0 left-0 right-0 z-10 p-6">
          <div className="max-w-md mx-auto">
            <div className={`backdrop-blur-lg rounded-2xl p-4 shadow-xl border transition-all duration-1000 ${
              isRevealed 
                ? 'bg-black/60 border-green-400/30' 
                : 'bg-white/80 border-white/20'
            }`}>
              <div className="flex items-center space-x-3">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={isRevealed ? "$ input_message" : "メッセージを入力..."}
                  className={`flex-1 bg-transparent border-0 focus:ring-0 focus:outline-none text-base transition-colors duration-1000 ${
                    isRevealed 
                      ? 'text-green-400 placeholder-green-600 font-mono' 
                      : 'text-gray-800 placeholder-gray-500'
                  }`}
                  style={isRevealed ? { textShadow: '0 0 5px rgba(34, 197, 94, 0.5)' } : {}}
                />
                <Button 
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim()}
                  size="icon"
                  className={`rounded-xl transition-all shadow-md duration-1000 ${
                    inputValue.trim() 
                      ? isRevealed 
                        ? 'bg-green-500 hover:bg-green-600 text-black border border-green-400/50' 
                        : 'bg-green-500 hover:bg-green-600 text-white'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                  style={isRevealed && inputValue.trim() ? { 
                    boxShadow: '0 0 15px rgba(34, 197, 94, 0.5)' 
                  } : {}}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* ページインジケーター */}
          <div className="flex justify-center mt-4">
            <motion.div 
              className={`w-32 h-1 rounded-full transition-colors duration-1000 ${
                isRevealed ? 'bg-green-400/40' : 'bg-white/40'
              }`}
              animate={isRevealed ? {
                boxShadow: '0 0 10px rgba(34, 197, 94, 0.5)'
              } : {}}
            />
          </div>
        </div>
      )}
    </div>
  );
}