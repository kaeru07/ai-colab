# ai-colab

## SF6 スクレイピングツール（Vercel対応）

このリポジトリのルートは、Vercelでそのまま表示できる **SF6 情報取得ツール** になっています。

- フロント: `index.html` + `script.js` + `styles.css`
- API: `api/sf6-scrape.js`（Vercel Serverless Function）

### できること

1. SF6のプロフィールページURLを入力して取得ボタンで情報表示
2. ランキングページURLを入力して取得ボタンで情報表示
3. 任意URL + セレクタ指定で簡易スクレイピング

> スクレイピング実行はすべてボタン操作で行えます。

## ローカル確認

```bash
cd /workspace/ai-colab
python3 -m http.server 8000
```

ブラウザで以下を開きます。

- フロント: `http://localhost:8000/`
- API（Vercel想定）: ローカル静的サーバーでは動かないため、Vercel上で `/api/sf6-scrape` を利用

## Vercel デプロイ手順

1. GitHub に push
2. Vercel で `New Project` → このリポジトリを import
3. Framework Preset は `Other`（または自動判定）
4. Build Command / Output Directory は空でOK
5. Deploy

Deploy後、`/` でツール画面、`/api/sf6-scrape` でAPIが利用できます。
