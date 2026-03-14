# ai-colab

## 麻雀ミニゲーム

`mahjong-app/` にブラウザで遊べるシンプルな麻雀ゲームを追加しました。

### 動作環境

- macOS / Linux / Windows / iPhone（ブラウザで動作）
- Python 3 が使える環境（ローカル配信用）

### 起動方法（PC でローカル起動）

```bash
cd /workspace/ai-colab
python3 -m http.server 8000
```

PCブラウザで `http://localhost:8000/mahjong-app/` を開いてください。

### iPhone での起動方法（明確版）

1. **PC と iPhone を同じ Wi-Fi に接続**します。
2. PC で以下を実行してサーバーを起動します。

```bash
cd /workspace/ai-colab
python3 -m http.server 8000
```

3. PC のローカルIPを確認します。
   - macOS / Linux: `ipconfig getifaddr en0` または `ifconfig`
   - Windows: `ipconfig`
4. iPhone の Safari で次のURLを開きます。

```text
http://<PCのローカルIP>:8000/mahjong-app/
```

例: `http://192.168.1.20:8000/mahjong-app/`

#### うまく開けないとき

- PC 側のファイアウォールで `8000` ポート通信を許可してください。
- VPN 接続中は同一LAN内通信が遮断されることがあるため、必要なら一時的に無効化してください。

#### macOS の補足

- Safari / Chrome / Firefox いずれでもアクセス可能です。
- ターミナルから直接開く場合は次のコマンドも使えます。

```bash
open http://localhost:8000/mahjong-app/
```

## Vercel デプロイ用 1 ページWebアプリ（iPhone完結）

このリポジトリのルートに、HTML/CSS/JavaScript だけで動く `Focus Timer` を配置しています。
Vercel へデプロイすると、`/` にそのまま表示されます。

### iPhoneだけで使う手順

1. Vercelの公開URLをiPhoneのSafariで開く
2. そのまま「開始」を押して利用
3. 必要なら Safari の共有メニューから「ホーム画面に追加」

### Vercel 公開手順

1. このリポジトリを GitHub に push
2. Vercel で `New Project` → 対象リポジトリを import
3. Framework Preset は `Other`（または自動判定のまま）
4. Build Command / Output Directory は未設定で OK（静的配信）
5. Deploy

### ローカル確認（任意）

```bash
cd /workspace/ai-colab
python3 -m http.server 8000
```

`http://localhost:8000/` を開くと確認できます。
