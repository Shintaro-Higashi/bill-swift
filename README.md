# 薬剤請求管理システム

## 技術スタック

- Next.js v13 (app directory利用)
  - バックエンドもapp directoryを利用したRestAPIを提供して実装
- Refine dev
  - 管理画面系構築FW。主要なComponentFrameWorkを自由に選択可能、カスタマイズ性が強い等の理由で採用
  - <https://refine.dev/docs/>
- ComponentFrameWork: MUI
- ORM: Prisma
- Test:
  - e2eはcypress(※PlayWright のほうが並列処理可能なため変更するかも)
  - 単体テストはjest
  - バックエンドはjest、それ以外はcypressが実装コストのバランスがよさそう
  - 複雑なフロントのコンポーネントはcypressのcomponent-test も実地するかも

## 開発環境の準備

- MySQL version8系をインストール
- フォルダ直下に .env.local をしてDB接続先を定義(.envのDATABASE_URLを参考にする)
- voltaをinstall (projectごとにNode,npmのversionを使い分けることが可能)
  - 参考: <https://zenn.dev/aiueda/articles/7dcecaa05d4f24>
- VSCodeをインストール（<https://code.visualstudio.com/）>
  - 拡張機能「NextJS Developer Extensions Pack」をインストール
    - 設定①：Editor: Default Formatter -> Prettier - Code formatter
    - 設定②：Editor: Format On Save -> チェック

## アプリケーションの実行準備

- `npm install` を実施してnode_modulesをinstall
- .env.local を.env の階層に作成する
  - 内容は.envの`下記は機密情報のため .env.local , .env.*.local 系に定義すること` 配下のコメント化された変数のみを定義する
- `npm run migrate:local` を実施してテーブルを作成
- `npm run prisma-generate` を実施してnode_modules配下に@prisma/client を生成
- `dotenv -e .env.local -- npx prisma db seed` を実施してログイン管理アカウントを作成
- `npx playwright install-deps` を実地してPlaywrightの関連モジュールを全てインストールする


## アプリケーションの実行法

```bash
npm run dev
```

- ログインは bill-admin / green@8-bill-system で可能です

---


※以降の情報は基盤開発中のメモ情報です。内容は参考程度に見てください

## カスタマイズ情報など共有情報

- ルーティング定義は routes/\*.tsx に各機能ごとに配置する
- primsaは prisma-case-format を利用してsnake_caseのカラム名定義を変数はcamelCaseに変換している
- DBのページング検索はprisma拡張クライアントを利用してpaginateメソッドを利用可能にしている
- MUIコンポーネントのpropsデフォルト値を定義する場合は core/contexts/themeContext.tsx に設定可
- アイコンはここから探す <https://mui.com/material-ui/material-icons/>
- styleの定義
  - MUIはsxプロパティを利用する
    - <https://mui.com/system/getting-started/the-sx-prop/>
    - <https://mui.com/system/properties/>
  - その他はemotionで定義する @emotion/react の記述がおすすめ？
    - <https://zuma-lab.com/posts/next-mui-emotion-settings>
    - CSS変換ツール <https://transform.tools/css-to-js>
- prisma extensionはhot reloadされないので注意

## 実装ルール

- coreの中身はルーティング情報以外を変更するときはなるべく周知すること(PRに特記事項として記述)
- 環境変数追加時は types/env.d.ts にも型情報を追加すること

## github開発運用ルール

develop(release前), review(お客様確認用) のブランチを用意して運用していく..とおもったが
PRの運用が手間になりそうなのでいい方法を検討中
