# prisma cli 主な利用方法

既存DB構成からschema.prismaを作成
```bash
npx prisma db pull
```

既存のDB構成からmigrationファイルを作成する方法
```bash
# migrationファイル保存用フォルダ作成
mkdir -p prisma/migrations/0_init
# migrationファイルを既存DBから作成
npx prisma migrate diff \
--from-empty \
--to-schema-datamodel prisma/schema.prisma \
--script > prisma/migrations/0_init/migration.sql
# migration管理テーブルに0_init/migration.sqlが適用済である履歴を作成
npx prisma migrate resolve --applied 0_init
```

migrationを実地(初期開発環境構築や本番環境に利用予定)
```bash
npx prisma migrate deploy
````
失敗したらロールバック可能(動作未確認)
```bash
prisma migrate resolve --rolled-back
```