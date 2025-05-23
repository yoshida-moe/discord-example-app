# #コンパス Discord bot

## 使い方

### コマンド追加

1. ターミナルで以下のコマンドを実行

    ```bash
    npm run register
    ```

### bot起動

1. ターミナルで以下のコマンドを実行

    ```bash
    npx ngrok http 3000
    ```

    実行結果（抜粋）

    ```bash
    Forwarding                    https://XXXX-XXX-XX-XXX-XXX.ngrok-free.app -> http://localhost:3000
    ```

2. 新しいターミナルで以下のコマンドを実行

    ```bash
    npm run start
    ```

3. [General Information](https://discord.com/developers/applications/1239098391464775700/information)を開く

4. 「Interactions Endpoint URL」に`npx ngrok http 3000`の実行結果の末尾に「'/interactions'」を追加して入力

    `https://XXXX-XXX-XX-XXX-XXX.ngrok-free.app/interactions`

5. 「Save Changes」ボタンを押下

6. 「All your edits have been carefully recorded.」と表示されれば成功
