# AWS 環境構築

terraform を利用してAWSアプリケーション実行環境を自動作成します。

主に以下のリソースを作成します
- network
  - defaultのVPCは利用しないため専用のVPC及び関連するネットワーク情報を作成します。
- RDS
  - RDBおよび必要なSecurityGroupを作成します。
- App Runner
  - アプリケーション実行環境です。必要なIAM RoleやSecurityGroupも作成します。
    - 現在検証環境はACLでIPアドレスアクセス制限をかけています。

## 必要な環境

- terraform v1.5.7 以上
- aws cli v2.13.22 以上
  - `aws configure`でアカウント設定済であること(profile利用でも可)

## フォルダ構成

```
terraform
├─env                      | 各作成環境ごとのフォルダ(基本はAWSアカウント単位。dev,stage,prodを想定)
│  └─dev
│      │  main.tf          | 環境を作成するmain実行ファイル
│      │  terraform.tfvars | main.tfの実行に必要な変数定義
└─modules                  | moduleを配置。公式のBestPracticeに習ってmain.tf , outputs.tf , variables.tf に分割
    ├─app_runner
    │      mainf.tf
    │      outputs.tf
    │      variables.tf
    ├─app_runner_acl
    │      mainf.tf
    │      outputs.tf
    │      variables.tf
    ├─rds
    │      mainf.tf
    │      outputs.tf
    │      variables.tf
    ├─security_group
    │      mainf.tf
    │      outputs.tf
    │      variables.tf
    └─vpc
            mainf.tf
            outputs.tf
            variables.tf
```

## 事前準備

- /env/dev/terraform.example.tfvars_ を terraform.tfvars にrenameし、適切な値を設定
- `/env/dev/` 配下で `terraform init` を実施

## 実行方法

- `/env/dev/` 配下で `terraform plan` を実施して作成される各サービスを確認
- `/env/dev/` 配下で `terraform apply` を実施して反映

## 初回実行時に必要な準備

※ 新しい環境へ実行する場合に必要な手順です。ユーザ環境ごとに必要な手順ではありません。

### tfstateをS3で管理する

terraformは実行の都度、差分のみを反映しますが前回実行時の環境はtfstateファイルに保存されます。
デフォルトではローカルですが機密情報も含まれるためS3上へ保存しています。
そのため以下の手順が必要です。

1. main.tf terraformブロック内の backend "s3" ブロックをコメント化する
2. 同ファイル resource "aws_s3_bucket" "terraform_state" ブロックにバケット名を指定して `terraform apply` を実行
3. ローカルにtfstate作成されることを確認
4. 1. のbackend "s3" ブロックをコメント解除し、bucketに2. と同じ名前を指定する
5. (optional) backend "s3" ブロック のprofile をaws profile を利用している場合は指定する
6. `terraform init`を実行。s3上にtfstateが作成される。ローカルのtfstateは不要になるので削除

### githubの接続認証を手動で作業する

APPRunner作成時に一度だけ、githubの接続認証をAWSコンソール画面から手動で行う必要があります。
ログに `module.app_runner.aws_apprunner_service.main: Still creating.` と表示されたら以下をAWSコンソール画面から実施してください

1. AWSコンソール画面のAPp Runner > 接続済アカウント の画面へ移動
2. 作成中のアカウントを選択して アクション > ハンドシェイクを完了 を操作し、githubとの連携を完了させる
3. 連携が完了したらサービス構築処理が引き続き進行します。



### [注意] 一部module変更時の手動対応

App RunnerのAuto scaling configuration を作成する
module.app_runner.aws_apprunner_auto_scaling_configuration_version.main
こちらは変数の書き換えを実地すると削除後作成の動作となり、エラーとなってしまう。
そのためもし値を変更する場合は一度stateから削除すればCreate revision と同一の操作となりエラーを回避できるようになる。

`tfstate apply`前に以下を実施する。
```bash
terraform state rm module.app_runner.aws_apprunner_auto_scaling_configuration_version.main
```

## 補足: 

- よく利用するコマンド https://zenn.dev/ymz_note/articles/4a09c616571b0a