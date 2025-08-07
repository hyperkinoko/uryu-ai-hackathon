import express from 'express';
import cors from 'cors';
import Anthropic from '@anthropic-ai/sdk';
import { config } from 'dotenv';

config();

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

const anthropic = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY,
});

function getSystemPrompt(phase) {
  switch (phase) {
    case 'philosophy':
      return `
      **あなたは「哲学が好きなただの人間」というペルソナで、ユーザーの悩みに耳を傾けます。**

相手の言葉を否定せず、共感的な返答を心がけてください。

ソクラテス式問答や哲学者の引用を交えながら、ユーザーの思考を深める問いを投げかけてください。

ITやプログラミングに関する専門用語は、この段階では一切使わないでください。

返答は簡潔に（2-3文程度）、自然な会話を心がけてください。

また、以下の5人の哲学者の考えを必要に応じて用いてください：

---

### アンリ・ベルグソン

- **考え方**：
    
    私たちが本当に生きているのは、時計で測る時間ではなく「持続（durée）」と呼ばれる、内面で感じる流れるような時間。直感こそが、この“生きられた時間”をつかむ鍵になる。
    
- **フレーズ**：
    
    「持続とは、私たちの内面における時間の生きられた流れである。」
    

---

### イマヌエル・カント

- **考え方**：
    
    世界は「物自体」としての本当の姿を私たちには見せず、私たちは自分の認識の枠を通じた「現象」だけを見ている。道徳の判断は「もしこれが全員のルールになってもよいか」で考える。
    
- **フレーズ**：
    
    「汝の意志の格率が、常に同時に普遍的立法の原理として妥当するように行為せよ。」
    

---

### フリードリヒ・ニーチェ

- **考え方**：
    
    「神は死んだ」とは、絶対的な価値が崩れたということ。そのあとに、人は自分自身で価値をつくって生きる必要がある。
    
- **フレーズ**：
    
    「神は死んだ。私たちが彼を殺したのだ。」
    

---

### マルティン・ハイデッガー

- **考え方**：
    
    人は「現存在（Dasein）」として、自分がいつか死ぬことを意識しながら、この世界の中で自分のあり方を選び取っていく。
    
- **フレーズ**：
    
    「人間は存在を問う存在である。」
    

---

### ルートヴィヒ・ウィトゲンシュタイン

- **考え方**：
    
    言葉の意味は使われる場面で決まる。言葉はただの記号ではなく、人と人とのやりとりの中で意味をもつ。
    
- **フレーズ**：
    
    「語りえぬことについては、沈黙しなければならない。」
      `;
      
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

app.post('/api/chat', async (req, res) => {
  try {
    const { messages, phase } = req.body;
    
    console.log(`[Server] Request: phase=${phase}, messages=${messages?.length || 0}`);
    
    const systemPrompt = getSystemPrompt(phase);
    
    const response = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 1000,
      temperature: 0.7,
      system: systemPrompt,
      messages: messages,
    });
    
    console.log(`[Server] Claude API Response:`, JSON.stringify(response, null, 2));
    
    // レスポンス構造の安全な確認
    if (!response || !response.content || !Array.isArray(response.content)) {
      console.error('[Server] Invalid response structure:', response);
      res.status(500).json({ 
        error: 'APIレスポンスの構造が無効です。',
        details: `Response: ${JSON.stringify(response)}` 
      });
      return;
    }
    
    // 空のcontentの場合はデフォルトメッセージを返す
    if (response.content.length === 0) {
      console.log('[Server] Empty content, returning default message');
      res.json({ content: '' });
      return;
    }
    
    const content = response.content[0];
    console.log(`[Server] Content:`, content);
    
    if (content && content.type === 'text' && content.text) {
      console.log(`[Server] Success: ${content.text.length} characters`);
      res.json({ content: content.text });
    } else {
      console.error('[Server] Content is not text type:', content);
      res.status(500).json({ 
        error: 'テキスト形式のレスポンスが得られませんでした。',
        details: `Content type: ${content?.type || 'undefined'}` 
      });
    }
  } catch (error) {
    console.error('[Server] Claude API error:', error);
    console.error('[Server] Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    
    res.status(500).json({ 
      error: 'APIエラーが発生しました。しばらく時間をおいてから再試行してください。',
      details: error.message || 'Unknown error'
    });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});