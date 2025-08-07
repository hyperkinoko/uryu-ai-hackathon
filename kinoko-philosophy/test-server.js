// server.jsのテストコード
import fetch from 'node-fetch';

const SERVER_URL = 'http://localhost:3001';

// テスト用のサンプル対話データ
const testCases = [
  {
    phase: 'philosophy',
    messages: [
      { role: 'user', content: 'こんにちは' }
    ],
    description: '初回挨拶テスト'
  },
  {
    phase: 'philosophy', 
    messages: [
      { role: 'user', content: '最近、人生に迷いを感じています。自分が何をしたいのかわからなくて...' }
    ],
    description: '人生相談テスト'
  },
  {
    phase: 'philosophy',
    messages: [
      { role: 'user', content: '仕事でミスが多くて、自信をなくしています。' },
      { role: 'assistant', content: 'お辛い状況ですね。ミスは誰にでもあることですが、それが続くと自信を失ってしまいますよね。' },
      { role: 'user', content: 'どうすればいいでしょうか？アドバイスをください。' }
    ],
    description: '解決策を求めるテスト（種明かしトリガー）'
  },
  {
    phase: 'reveal',
    messages: [
      { role: 'user', content: '仕事でミスが多くて困っています。' },
      { role: 'assistant', content: 'それは確かに心配ですね。' },
      { role: 'user', content: 'どうすればいいでしょうか？' }
    ],
    description: '種明かしフェーズテスト'
  },
  {
    phase: 'report',
    messages: [
      { role: 'user', content: '最近仕事で失敗が続いています。' },
      { role: 'assistant', content: '失敗は学習の機会でもありますね。' },
      { role: 'user', content: 'でも自信がなくなってしまって...' },
      { role: 'assistant', content: '自信を失うのも自然な反応です。一歩ずつ進んでいけばいいんです。' }
    ],
    description: 'レポート生成テスト'
  }
];

// カラー出力用のヘルパー関数
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

function log(color, message) {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// APIテスト関数
async function testAPI(testCase, index) {
  log('blue', `\n=== テスト ${index + 1}: ${testCase.description} ===`);
  log('yellow', `Phase: ${testCase.phase}`);
  log('yellow', `Messages: ${testCase.messages.length}件`);
  
  try {
    const startTime = Date.now();
    
    const response = await fetch(`${SERVER_URL}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: testCase.messages,
        phase: testCase.phase
      })
    });
    
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.error);
    }
    
    log('green', '✅ 成功');
    log('yellow', `レスポンス時間: ${responseTime}ms`);
    log('blue', `応答内容: ${data.content.substring(0, 100)}${data.content.length > 100 ? '...' : ''}`);
    
    // レスポンス品質チェック
    const content = data.content;
    const checks = {
      '空でない': content && content.trim().length > 0,
      '適切な長さ': content.length > 10 && content.length < 2000,
      '日本語': /[ひらがなカタカナ漢字]/.test(content)
    };
    
    log('yellow', '品質チェック:');
    Object.entries(checks).forEach(([check, result]) => {
      log(result ? 'green' : 'red', `  ${result ? '✅' : '❌'} ${check}`);
    });
    
    return { success: true, responseTime, content, checks };
    
  } catch (error) {
    log('red', '❌ エラー');
    log('red', `エラー詳細: ${error.message}`);
    return { success: false, error: error.message };
  }
}

// サーバー接続テスト
async function testServerConnection() {
  log('blue', '\n=== サーバー接続テスト ===');
  
  try {
    const response = await fetch(`${SERVER_URL}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [{ role: 'user', content: 'テスト' }],
        phase: 'philosophy'
      })
    });
    
    if (response.status === 200) {
      log('green', '✅ サーバーは正常に動作しています');
      return true;
    } else {
      log('red', `❌ サーバーエラー: ${response.status}`);
      return false;
    }
  } catch (error) {
    log('red', `❌ サーバーに接続できません: ${error.message}`);
    log('yellow', 'サーバーが起動しているか確認してください: node server.js');
    return false;
  }
}

// 負荷テスト
async function loadTest() {
  log('blue', '\n=== 負荷テスト（5回同時リクエスト） ===');
  
  const promises = Array(5).fill().map((_, i) => 
    testAPI({
      phase: 'philosophy',
      messages: [{ role: 'user', content: `負荷テスト${i + 1}` }],
      description: `負荷テスト${i + 1}`
    }, i)
  );
  
  try {
    const results = await Promise.all(promises);
    const successful = results.filter(r => r.success).length;
    log(successful === 5 ? 'green' : 'red', `✅ ${successful}/5 のリクエストが成功`);
  } catch (error) {
    log('red', `❌ 負荷テストでエラー: ${error.message}`);
  }
}

// メインテスト実行
async function runAllTests() {
  log('green', '🚀 server.js テスト開始');
  
  // サーバー接続確認
  const serverConnected = await testServerConnection();
  if (!serverConnected) {
    return;
  }
  
  // 各テストケース実行
  const results = [];
  for (let i = 0; i < testCases.length; i++) {
    const result = await testAPI(testCases[i], i);
    results.push(result);
    
    // テスト間の待機
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  // 負荷テスト
  await loadTest();
  
  // 結果サマリー
  log('blue', '\n=== テスト結果サマリー ===');
  const successful = results.filter(r => r.success).length;
  const avgResponseTime = results
    .filter(r => r.responseTime)
    .reduce((sum, r) => sum + r.responseTime, 0) / results.length || 0;
  
  log('green', `成功: ${successful}/${results.length}`);
  log('yellow', `平均レスポンス時間: ${Math.round(avgResponseTime)}ms`);
  
  if (successful === results.length) {
    log('green', '🎉 すべてのテストが成功しました！');
  } else {
    log('red', '⚠️  いくつかのテストが失敗しました');
  }
}

// 単体テスト用の関数もエクスポート
export { testAPI, testServerConnection, loadTest };

// コマンドライン実行時
if (import.meta.url === `file://${process.argv[1]}`) {
  runAllTests().catch(error => {
    log('red', `テスト実行エラー: ${error.message}`);
    process.exit(1);
  });
}