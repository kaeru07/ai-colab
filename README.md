# ai-colab

## 麻雀ミニゲーム

`mahjong-app/` にブラウザで遊べるシンプルな麻雀ゲームを追加しました。

### 動作環境

- macOS / Linux / Windows（ブラウザで動作）
- Python 3 が使える環境（ローカル配信用）

### 起動方法（macOS を含む共通手順）

```bash
cd /workspace/ai-colab
python3 -m http.server 8000
```

ブラウザで `http://localhost:8000/mahjong-app/` を開いてください。

#### macOS の補足

- Safari / Chrome / Firefox いずれでもアクセス可能です。
- ターミナルから直接開く場合は次のコマンドも使えます。

```bash
open http://localhost:8000/mahjong-app/
```
