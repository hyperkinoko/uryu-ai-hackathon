import React from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Lightbulb, Target, ArrowRight, RefreshCw, ArrowLeft } from 'lucide-react';
import { Message } from '../App';
import eddiImage from 'figma:asset/53eaeb8c8d90af852399e1dfcaeeb6a051c9a4c9.png';

interface ResultScreenProps {
  messages: Message[];
  onRestart: () => void;
}

export default function ResultScreen({ messages, onRestart }: ResultScreenProps) {
  // モックデータ（実際のAI分析の代わり）
  const analysisResult = {
    summary: "あなたは現在、自己成長への強い意欲を持ちながらも、方向性に迷いを感じている状態です。これは多くの向上心のある人が通る道であり、むしろ前向きな兆候と言えます。",
    problem_definition: "主な課題は「目標の曖昧さ」と「完璧主義的な思考パターン」です。理想と現実のギャップに焦点を当てすぎて、小さな進歩を見落としている可能性があります。",
    it_tips: [
      "デバッグの考え方：問題を小さな単位に分割して、一つずつ解決していく",
      "テスト駆動開発：小さな目標を立てて、達成できたかテストする習慣",
      "リファクタリング：現在の状況を「改善の余地がある状態」と捉え、段階的に最適化する",
      "バージョン管理：今の自分を「現在のバージョン」として受け入れ、次のバージョンアップを計画する"
    ],
    next_step: "今週中に、大きな目標を3つの小さなタスクに分解し、1つでも着手してみてください。完璧でなくても構いません。「動くプロトタイプ」を作ることから始めましょう。"
  };

  const userMessages = messages.filter(m => m.isUser);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* 美しい背景グラデーション */}
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-200 via-blue-100 to-purple-100">
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-100/30 via-transparent to-blue-200/20"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-purple-200/40 via-transparent to-transparent"></div>
      </div>

      {/* 雲のような装飾 */}
      <div className="absolute top-10 left-10 w-32 h-16 bg-white/40 rounded-full blur-xl"></div>
      <div className="absolute top-20 right-20 w-40 h-20 bg-white/30 rounded-full blur-xl"></div>
      <div className="absolute top-32 left-1/3 w-24 h-12 bg-white/50 rounded-full blur-lg"></div>

      {/* ヘッダー */}
      <div className="relative z-10 flex justify-between items-center p-6">
        <Button variant="ghost" size="icon" className="text-gray-700 bg-white/20 hover:bg-white/30 backdrop-blur-sm">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">
          分析完了
        </div>
        <div className="w-10"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto p-6 space-y-6">
        {/* ヘッダー情報 */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="relative">
              <img 
                src={eddiImage}
                alt="エディ太（きのこ先生）"
                className="w-24 h-24 object-contain drop-shadow-2xl"
              />
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-500 rounded-full border-4 border-white shadow-lg"></div>
            </div>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2 drop-shadow-sm">思考デバッグ完了</h1>
            <p className="text-gray-600 drop-shadow-sm">
              IT研修講師の視点から、あなたの思考を分析しました
            </p>
            <Badge className="mt-3 bg-green-500 text-white shadow-lg">
              対話数: {userMessages.length}回
            </Badge>
          </div>
        </div>

        {/* 分析結果 */}
        <div className="grid gap-4">
          {/* サマリー */}
          <Card className="bg-white/90 backdrop-blur-lg border-white/20 p-6 shadow-xl">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <Target className="w-4 h-4 text-blue-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">対話のサマリー</h2>
            </div>
            <p className="text-gray-700 leading-relaxed">{analysisResult.summary}</p>
          </Card>

          {/* 課題の定義 */}
          <Card className="bg-white/90 backdrop-blur-lg border-white/20 p-6 shadow-xl">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Lightbulb className="w-4 h-4 text-yellow-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">課題の定義</h2>
            </div>
            <p className="text-gray-700 leading-relaxed">{analysisResult.problem_definition}</p>
          </Card>

          {/* IT講師からのTips */}
          <Card className="bg-white/90 backdrop-blur-lg border-white/20 p-6 shadow-xl">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <ArrowRight className="w-4 h-4 text-green-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">きのこ先生からのTips</h2>
            </div>
            <div className="space-y-3">
              {analysisResult.it_tips.map((tip, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold">{index + 1}</span>
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed flex-1">
                    {tip}
                  </p>
                </div>
              ))}
            </div>
          </Card>

          {/* 次の一歩 */}
          <Card className="bg-gradient-to-r from-blue-500/90 to-purple-500/90 backdrop-blur-lg border-white/20 p-6 shadow-xl">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <RefreshCw className="w-4 h-4 text-blue-600" />
              </div>
              <h2 className="text-xl font-bold text-white">次の一歩</h2>
            </div>
            <p className="text-white leading-relaxed font-medium">
              {analysisResult.next_step}
            </p>
          </Card>
        </div>

        {/* アクションボタン */}
        <div className="text-center space-y-4 pt-6">
          <Button 
            onClick={onRestart}
            className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white px-8 py-3 h-12 rounded-2xl transition-all shadow-xl font-medium"
          >
            新しい対話を始める
          </Button>
          <p className="text-gray-600 text-sm drop-shadow-sm">
            このレポートを参考に、自分なりの一歩を踏み出してみてください
          </p>
        </div>
      </div>
    </div>
  );
}