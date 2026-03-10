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

---

## 完全にiPhone単体で使えるメモアプリ

`iphone-standalone-memo/index.html` は **1ファイル完結**のメモアプリです。
外部ライブラリもサーバーも不要で、iPhone上だけで動作します（保存先はそのブラウザの localStorage）。

### iPhone単体での使い方

1. `iphone-standalone-memo/index.html` を iPhone の「ファイル」アプリへ保存（AirDrop / iCloud Drive など）。
2. iPhoneでそのHTMLファイルを開く。
3. 画面共有メニューから Safari で開ける場合は Safari で開く（推奨）。
4. 必要なら「ホーム画面に追加」して、アプリのように起動する。

### 機能

- メモの追加・削除
- 検索
- ピン留め（固定）
- JSONバックアップのエクスポート / インポート
- 端末内保存（localStorage）
