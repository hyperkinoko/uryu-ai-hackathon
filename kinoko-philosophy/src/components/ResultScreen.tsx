import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Lightbulb, Target, ArrowRight, RefreshCw } from 'lucide-react';
import { Message } from '../App';
import { callClaude, ChatMessage as APIChatMessage } from '../lib/api';

interface ResultScreenProps {
  messages: Message[];
  onRestart: () => void;
}

interface AnalysisResult {
  summary: string;
  problem_definition: string;
  it_tips: string[];
  next_step: string;
}

export default function ResultScreen({ messages, onRestart }: ResultScreenProps) {
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    generateAnalysis();
  }, [messages]);

  const generateAnalysis = async () => {
    setIsLoading(true);
    try {
      const apiMessages: APIChatMessage[] = messages
        .filter(m => !m.id.includes('reveal'))
        .map(m => ({
          role: m.isUser ? 'user' : 'assistant',
          content: m.text
        }));

      const response = await callClaude(apiMessages, 'report');
      
      try {
        const parsedResult = JSON.parse(response);
        setAnalysisResult(parsedResult);
      } catch (parseError) {
        console.error('Failed to parse analysis result:', parseError);
        // フォールバック用のモックデータ
        setAnalysisResult({
          summary: "あなたは現在、自己成長への強い意欲を持ちながらも、方向性に迷いを感じている状態です。これは多くの向上心のある人が通る道であり、むしろ前向きな兆候と言えます。",
          problem_definition: "主な課題は「目標の曖昧さ」と「完璧主義的な思考パターン」です。理想と現実のギャップに焦点を当てすぎて、小さな進歩を見落としている可能性があります。",
          it_tips: [
            "デバッグの考え方：問題を小さな単位に分割して、一つずつ解決していく",
            "テスト駆動開発：小さな目標を立てて、達成できたかテストする習慣",
            "リファクタリング：現在の状況を「改善の余地がある状態」と捉え、段階的に最適化する",
            "バージョン管理：今の自分を「現在のバージョン」として受け入れ、次のバージョンアップを計画する"
          ],
          next_step: "今週中に、大きな目標を3つの小さなタスクに分解し、1つでも着手してみてください。完璧でなくても構いません。「動くプロトタイプ」を作ることから始めましょう。"
        });
      }
    } catch (error) {
      console.error('Failed to generate analysis:', error);
      // エラー時のフォールバックデータ
      setAnalysisResult({
        summary: "対話を通じて、あなたの思考パターンや悩みの構造を理解することができました。",
        problem_definition: "現在の状況を整理し、具体的な改善点を見つけることが重要です。",
        it_tips: [
          "問題を小さな単位に分解する",
          "一つずつ着実に解決していく",
          "進捗を定期的に確認する",
          "完璧を求めすぎずに行動する"
        ],
        next_step: "今日から一つでも小さな行動を始めてみましょう。"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const userMessages = messages.filter(m => m.isUser);

  if (isLoading || !analysisResult) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-blue-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-lg">分析結果を生成中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-blue-900 text-white p-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* ヘッダー */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <img 
              src="/images/edita.png"
              alt="エディ太（きのこ先生）"
              className="w-16 h-16 rounded-full"
            />
          </div>
          <h1 className="text-3xl font-bold">思考デバッグ完了</h1>
          <p className="text-gray-300">
            IT研修講師の視点から、あなたの思考を分析しました
          </p>
          <Badge className="bg-green-600 text-white">
            対話数: {userMessages.length}回
          </Badge>
        </div>

        {/* 分析結果 */}
        <div className="grid gap-6">
          {/* サマリー */}
          <Card className="bg-slate-800 border-slate-700 p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Target className="w-5 h-5 text-blue-400" />
              <h2 className="text-xl font-bold text-white">対話のサマリー</h2>
            </div>
            <p className="text-gray-300 leading-relaxed">{analysisResult.summary}</p>
          </Card>

          {/* 課題の定義 */}
          <Card className="bg-slate-800 border-slate-700 p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Lightbulb className="w-5 h-5 text-yellow-400" />
              <h2 className="text-xl font-bold text-white">課題の定義</h2>
            </div>
            <p className="text-gray-300 leading-relaxed">{analysisResult.problem_definition}</p>
          </Card>

          {/* IT講師からのTips */}
          <Card className="bg-slate-800 border-slate-700 p-6">
            <div className="flex items-center space-x-2 mb-4">
              <ArrowRight className="w-5 h-5 text-green-400" />
              <h2 className="text-xl font-bold text-white">きのこ先生からのTips</h2>
            </div>
            <div className="space-y-3">
              {analysisResult.it_tips.map((tip, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <Badge className="bg-blue-600 text-white text-xs mt-1">
                    {index + 1}
                  </Badge>
                  <p className="text-gray-300 text-sm leading-relaxed flex-1">
                    {tip}
                  </p>
                </div>
              ))}
            </div>
          </Card>

          {/* 次の一歩 */}
          <Card className="bg-gradient-to-r from-green-800 to-blue-800 border-green-600 p-6">
            <div className="flex items-center space-x-2 mb-4">
              <RefreshCw className="w-5 h-5 text-white" />
              <h2 className="text-xl font-bold text-white">次の一歩</h2>
            </div>
            <p className="text-white leading-relaxed font-medium">
              {analysisResult.next_step}
            </p>
          </Card>
        </div>

        {/* アクションボタン */}
        <div className="text-center space-y-4">
          <Button 
            onClick={onRestart}
            className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3"
          >
            新しい対話を始める
          </Button>
          <p className="text-gray-400 text-sm">
            このレポートを参考に、自分なりの一歩を踏み出してみてください
          </p>
        </div>
      </div>
    </div>
  );
}