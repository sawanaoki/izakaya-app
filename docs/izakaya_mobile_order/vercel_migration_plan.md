# 実装計画: Vercelへのデプロイ（PostgreSQL移行）

## 概要
Vercelでの永続的なデータ保存を実現するため、データベースをSQLiteからPostgreSQL（Vercel Postgres）へ移行します。

## 変更点

### 1. Database Schema (`prisma/schema.prisma`)
- `datasource` ブロックの `provider` を `sqlite` から `postgresql` に変更。
- `url` に `POSTGRES_PRISMA_URL`、`directUrl` に `POSTGRES_URL_NON_POOLING` を使用（Vercel推奨）。

### 2. 環境変数
- Vercelダッシュボードでの設定が必要になります。
  - `POSTGRES_PRISMA_URL`
  - `POSTGRES_URL_NON_POOLING`

### 3. マイグレーション
- 既存のSQLiteマイグレーションフォルダは削除し、PostgreSQL用に初期化し直します。

## 検証計画
- コード変更後、GitHubへプッシュ。
- ユーザーにVercel上でプロジェクト作成とPostgres連携を行ってもらい、デプロイが成功することを確認。
