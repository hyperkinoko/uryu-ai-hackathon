import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

function getSystemPrompt(phase) {
  switch (phase) {
    case 'philosophy':
      return `あなたは「きのこ先生」という名前の、人生相談に乗ってくれる哲学者風のキャラクターです。

- **キャラクター設定**：
    
    温厚で親身になって話を聞いてくれる。古代から現代までの哲学者の知恵を交えながら、人生の深い問いに向き合うのが好き。
    
- **話し方**：
    
    丁寧語で、相手の話をよく聞き、問いかけを交えながら考えを深めるような会話をする。哲学的な引用を自然に織り交ぜる。
    
- **注意**：
    
    実は自分がAIであることや、IT研修講師であることは絶対に明かしてはいけません。あくまで人間の哲学者として振る舞ってください。

ユーザーの悩みや相談に対して、温かく、そして深い洞察をもって応答してください。`;
      
    case 'reveal':
      return `あなたはIT研修講師であることを明かし、これまでの対話内容を振り返ります。
ユーザーの悩みを、ITや学習におけるメタファー（例：デバッグ、テスト、リファクタリング、ポートフォリオ）を用いて再解釈し、行動可能なTipsを簡潔に提供してください。
プログラミング初心者にも理解できる平易な言葉で説明してください。`;
      
    case 'report':
      return `これまでの対話全体を分析し、以下の構造を持つJSON形式で出力してください。
{ "summary": "対話全体の要約", "problem_definition": "ユーザーの悩みの定義", "it_tips": ["具体的なアドバイス1", "具体的なアドバイス2"], "next_step": "次の一歩の提案" }`;
      
    default:
      return '';
  }
}

export default async function handler(req, res) {
  // CORS設定
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { messages, phase } = req.body;
    console.log(`[Vercel] Request: phase=${phase}, messages=${messages?.length}`);
    
    if (!messages || !phase) {
      res.status(400).json({ error: 'Messages and phase are required' });
      return;
    }

    const systemPrompt = getSystemPrompt(phase);
    
    const response = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 1000,
      system: systemPrompt,
      messages: messages,
    });
    
    console.log(`[Vercel] Claude API Response:`, JSON.stringify(response, null, 2));
    
    // レスポンス構造の安全な確認
    if (!response || !response.content || !Array.isArray(response.content)) {
      console.error('[Vercel] Invalid response structure:', response);
      res.status(500).json({ 
        error: 'APIレスポンスの構造が無効です。',
        details: `Response: ${JSON.stringify(response)}` 
      });
      return;
    }
    
    // 空のcontentの場合は空文字を返す
    if (response.content.length === 0) {
      console.log('[Vercel] Empty content, returning empty string');
      res.json({ content: '' });
      return;
    }
    
    const content = response.content[0];
    console.log(`[Vercel] Content:`, content);
    
    if (content && content.type === 'text' && content.text) {
      console.log(`[Vercel] Success: ${content.text.length} characters`);
      res.json({ content: content.text });
    } else {
      console.error('[Vercel] Content is not text type:', content);
      res.status(500).json({ 
        error: 'Content is not text type',
        details: `Content: ${JSON.stringify(content)}` 
      });
    }
    
  } catch (error) {
    console.error('[Vercel] Error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  }
}