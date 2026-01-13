# 外部データベース (Neon) セットアップガイド

Vercelの標準機能でエラーが続くため、より確実な方法として **Neon**（無料のPostgresサービス）を直接使用します。

## 手順1: Neonでデータベース作成
1. [Neon公式サイト](https://neon.tech/) にアクセスし、**Sign Up** (Sign In) します。
2. **Create a project** をクリックします。
   - name: `izakaya-db` (任意)
   - Postgres version: 最新のもの (15や16など)
   - Region: **Singapore** (日本に一番近い) または **US East**
3. **Create project** を押すと、接続情報（Connection String）が表示されます。

## 手順2: 接続情報の取得
ダッシュボード（project dashboard）で、**Connection String** を探します。

1. **Pooled connection** のチェックが入っている状態のURLをコピーします。
   - これが `DATABASE_URL` になります。
2. 次に、**Pooled connection** のチェックを**外した** URL も確認しておきます。
   - これが `DIRECT_URL` になります。

## 手順3: Vercelへの環境変数設定
Vercelのダッシュボードに戻り、手動で変数を設定します。

1. Vercelのトップページから、今回のプロジェクト **`izakaya-app`** をクリックして開きます。
2. 画面上部にあるタブメニュー（Overview, Deployments...などが並んでいるところ）の一番右にある **Settings** をクリックします。
3. 左側のサイドメニューにある **Environment Variables** をクリックします。
4. 以下の2つを追加します：

| Key | Value |
| --- | --- |
| `DATABASE_URL` | 手順2-1でコピーしたURL (Pooled) |
| `DIRECT_URL` | 手順2-2で確認したURL (Direct) |

※ もし以前の `POSTGRES_...` という変数が残っていたら、念のため削除しておくと紛らわしくなくて良いです。

## 手順4: デプロイ
環境変数をセットしたら、**Deployments** タブに戻り、最新のデプロイを **Redeploy** してください。
今度こそ成功するはずです！
