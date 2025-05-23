# MEMO

ターミナルで以下のコマンドを実行

```bash
npx ngrok http 3000
```

実行結果

```bash
Forwarding                    https://0be4-160-86-241-60.ngrok-free.app -> http://localhost:3000
```

新しいターミナルで以下のコマンドを実行

```bash
npm run start
```

[General Information](https://discord.com/developers/applications/1239098391464775700/information)を開く

「Interactions Endpoint URL」に以下の内容を入力

`https://0be4-160-86-241-60.ngrok-free.app/interactions`

「Save Changes」ボタンを押下

「All your edits have been carefully recorded.」と表示されれば成功