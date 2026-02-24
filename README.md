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

### iPhone から遊ぶ方法

1. PC と iPhone を同じ Wi-Fi に接続する。
2. PC で上記コマンドを実行してサーバーを起動する。
3. PC のローカルIPを確認する（例: `192.168.1.20`）。
4. iPhone の Safari で `http://<PCのローカルIP>:8000/mahjong-app/` を開く。

例: `http://192.168.1.20:8000/mahjong-app/`

#### macOS の補足

- Safari / Chrome / Firefox いずれでもアクセス可能です。
- ターミナルから直接開く場合は次のコマンドも使えます。

```bash
open http://localhost:8000/mahjong-app/
```
