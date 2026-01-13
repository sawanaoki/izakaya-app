# Vercelデプロイ手順書（PostgreSQL対応版）

アプリケーションをVercelにデプロイし、一般公開するための手順です。
既にコードはGitHubにプッシュされ、PostgreSQL対応の状態になっています。

## 手順1: Vercelプロジェクトの作成
1. [Vercelダッシュボード](https://vercel.com/dashboard) にアクセス。
2. **"Add New..."** -> **"Project"** をクリック。
3. リポジトリ **`izakaya-app`** を選択して **"Import"** をクリック。
4. 設定画面が表示されます。
   - **Framework Preset**: `Next.js` (自動検出されるはずですが、確認してください)
   - **Root Directory**: **`Edit` を押して `web-app` を選択してください。**
     - 重要: これを行わないと、`package.json` が見つからずエラーになります。
5. **まだ"Deploy"は押しません**。（データベース設定が必要です）

## 手順2: データベース (Vercel Postgres) の作成
1. 左側のメニュー（またはダッシュボードトップ）から **"Storage"** を選択。
2. **"Create Database"** -> **"Postgres"** を選択。
3. 以下の設定で作成:
   - **Database Name**: `izakaya-db` (任意)
   - **Region**: `Japan (Tokyo) - hnd1` (推奨)
4. 作成が完了するのを待ちます。

## 手順3: プロジェクトとデータベースの接続
1. 作成したデータベースの画面で、左メニューの **"Projects"** をクリック。
2. **"Connect Project"** で、先ほど作成（インポート中）の `izakaya-app` プロジェクトを選択して **"Connect"**。
   - これで必要な環境変数（`POSTGRES_PRISMA_URL` など）が自動的に設定されます。
   - **確認**: Settings > Environment Variables に `POSTGRES_PRISMA_URL` や `POSTGRES_URL_NON_POOLING` が追加されていることを確認してください。もし無い場合は、もう一度 "Storage" タブから接続を確認するか、"Pull Latest" などを試してください。

## 手順4: ビルド設定の変更とデプロイ
1. プロジェクトの設定画面（Settings）に戻ります。
2. **"Build & Development Settings"** を開きます。
3. **Build Command** の **OVERRIDE** をオンにし、以下のコマンドを入力します：
   **以下のコマンドをそのまま（バッククォートなどは含まずに）コピーして貼り付けてください：**
   `npx prisma generate && npx prisma db push && npx prisma db seed && next build`
   
   - 解説: これにより、「Prismaクライアント生成」→「**DBテーブル強制作成**」→「**初期データ投入**」→「アプリのビルド」が行われます。
   - ※以前の `migrate deploy` だとテーブルが作られずエラーになっていました。
4. **"Deploy"** をクリックしてデプロイを開始します。

## 手順5: 動作確認
- デプロイが完了すると、公開URL（例: `https://izakaya-app.vercel.app`）が発行されます。
- 管理画面 (`/admin`) にアクセスし、メニュー登録などが動くか確認してください。

## トラブルシューティング

### Q. `Error: Environment variable not found: POSTGRES_URL_NON_POOLING` と出る
**原因**: プロジェクトとデータベースの接続がうまくいっていません。
**対処法**:
1. Vercelダッシュボードの **Settings** > **Environment Variables** を確認してください。
2. `POSTGRES_URL_NON_POOLING` や `POSTGRES_PRISMA_URL` が一覧に**無い**場合：
   - 上部メニュー **Storage** に行き、一度現在のデータベースを **Disconnect** してください。
   - その後、再度 **Connect** してください。
   - Connect時、**"Production"** などの環境すべてにチェックが入っていることを確認してください。
3. これで環境変数がセットされたら、**Redeploy** を行ってください。
