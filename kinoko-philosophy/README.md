# きのこ先生と哲学対話

IT研修講師のきのこ先生と、あなたの思考をデバッグするAI対話ツール

## 🚀 セットアップ

### 1. 依存関係のインストール
```bash
npm install
```

### 2. 環境変数の設定
`.env.local` ファイルを作成し、Claude API キーを設定してください：

```env
VITE_CLAUDE_API_KEY=your_anthropic_api_key_here
```

### 3. 画像ファイルの配置
以下の画像ファイルを `public/images/` に配置してください：
- `kinoko.png` - きのこ先生の画像
- `edita.png` - エディ太（講師モード）の画像

### 4. 開発サーバーの起動
```bash
npm run dev
```

アプリケーションは http://localhost:5173 で起動します。

## 📱 機能

- **初期画面**: きのこ先生との哲学対話を開始
- **対話画面**: Claude APIを使用したリアルタイム哲学対話
- **種明かし演出**: 特定条件でIT研修講師としての正体を明かす
- **結果画面**: 対話内容の構造化レポート生成

## 🛠 技術スタック

- **React 18** + **TypeScript**
- **Vite** (開発環境)
- **TailwindCSS** (スタイリング)
- **shadcn/ui** (UIコンポーネント)
- **Claude API** (Anthropic SDK)
- **Lucide React** (アイコン)

## 🎨 特徴

- Figmaデザインに忠実な高品質UI
- スムーズなアニメーション効果
- レスポンシブデザイン
- エラーハンドリング対応
- 種明かし時のダイナミックなテーマ切り替え

## 🏗 プロジェクト構成

```
kinoko-philosophy/
├── public/
│   └── images/          # 画像リソース
├── src/
│   ├── components/      # Reactコンポーネント
│   │   ├── ui/         # shadcn/ui コンポーネント
│   │   ├── WelcomeScreen.tsx
│   │   ├── ChatScreen.tsx
│   │   ├── ChatMessage.tsx
│   │   └── ResultScreen.tsx
│   ├── lib/
│   │   ├── api.ts      # Claude API連携
│   │   └── utils.ts    # ユーティリティ関数
│   ├── App.tsx         # メインアプリケーション
│   └── main.tsx        # エントリーポイント
├── .env.local          # 環境変数（要設定）
└── README.md
```