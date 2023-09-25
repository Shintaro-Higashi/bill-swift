/* ----------------------------------------------------------------------------
 * テーブル削除
 * --------------------------------------------------------------------------*/
DROP TABLE if exists inquiry_file CASCADE;
DROP TABLE if exists inquiry_correspond CASCADE;
DROP TABLE if exists inquiry CASCADE;
DROP TABLE if exists patient_change_content CASCADE;
DROP TABLE if exists patient_change_history CASCADE;
DROP TABLE if exists patient_file CASCADE;
DROP TABLE if exists patient_code_history CASCADE;
DROP TABLE if exists patient_relate_health_facility CASCADE;
DROP TABLE if exists patient CASCADE;
DROP TABLE if exists health_facility_relate_pharmacy CASCADE;
DROP TABLE if exists health_facility_code_manage CASCADE;
DROP TABLE if exists health_facility CASCADE;
DROP TABLE if exists pharmacy_base_compounding_setting CASCADE;
DROP TABLE if exists pharmacy CASCADE;
DROP TABLE if exists pharmacy_group CASCADE;
DROP TABLE if exists company CASCADE;
DROP TABLE if exists health_facility_code_group CASCADE;
DROP TABLE if exists user CASCADE;


/* ----------------------------------------------------------------------------
 * テーブル作成
 * --------------------------------------------------------------------------*/
-- ユーザー
CREATE TABLE user (
  id VARCHAR(64) NOT NULL COMMENT 'ID'
  , user_type enum('ADMIN', 'STAFF', 'PHARMACY', 'PATIENT') NOT NULL COMMENT 'ユーザー種別:ADMIN: 管理者, STAFF: 業務課, PHARMACY: 店舗, PATIENT: 患者'
  , mail VARCHAR(128) NOT NULL COMMENT 'メールアドレス:ログインIDとして利用'
  , name VARCHAR(128) NOT NULL COMMENT '氏名'
  , password VARCHAR(255) COMMENT 'パスワード'
  , pharmacy_id VARCHAR(64) COMMENT '薬局ID:ユーザー種別が薬局の場合にそのIDを設定する'
  , patient_id VARCHAR(64) COMMENT '患者ID:ユーザー種別が患者の場合にそのIDを設定する'
  , created_at TIMESTAMP NULL DEFAULT NULL COMMENT '登録日時'
  , created_by VARCHAR(64) COMMENT '登録ユーザーID'
  , updated_at TIMESTAMP NULL DEFAULT NULL COMMENT '更新日時'
  , updated_by VARCHAR(64) COMMENT '更新ユーザーID'
  , deleted_at TIMESTAMP NULL DEFAULT NULL COMMENT '削除日時'
  , existence boolean as (CASE WHEN deleted_at IS NULL THEN 1 ELSE NULL END) COMMENT '削除有無:1:有効 NULL:論理削除'
  , CONSTRAINT user_PKC PRIMARY KEY (id)
) COMMENT 'ユーザー:スタッフと患者の基本情報としてユーザーを定義している
MyPage の構想があるので、とりあえず同じ枠に入れている' ;


-- 施設コードグループ
CREATE TABLE health_facility_code_group (
  id VARCHAR(64) NOT NULL COMMENT 'ID'
  , name VARCHAR(64) NOT NULL COMMENT '名称'
  , format_type enum('SIMPLE', 'PADDING') NOT NULL COMMENT 'フォーマットタイプ:SIMPLE: 数値をそのまま文字列化, PADDING: 数値を前0埋めして文字列化'
  , created_at TIMESTAMP NULL DEFAULT NULL COMMENT '登録日時'
  , created_by VARCHAR(64) COMMENT '登録ユーザーID'
  , updated_at TIMESTAMP NULL DEFAULT NULL COMMENT '更新日時'
  , updated_by VARCHAR(64) COMMENT '更新ユーザーID'
  , deleted_at TIMESTAMP NULL DEFAULT NULL COMMENT '削除日時'
  , existence boolean as (CASE WHEN deleted_at IS NULL THEN 1 ELSE NULL END) COMMENT '削除有無:1:有効 NULL:論理削除'
  , CONSTRAINT health_facility_code_group_PKC PRIMARY KEY (id)
) COMMENT '施設コードグループ:施設の採番単位のグループを管理' ;

-- 会社
CREATE TABLE company (
  id VARCHAR(64) NOT NULL COMMENT 'ID'
  , name VARCHAR(64) NOT NULL COMMENT '名称'
  , name_kana VARCHAR(128) NOT NULL COMMENT 'カナ名称'
  , postal_code CHAR(8) NOT NULL COMMENT '郵便番号:ハイフン付き「NNN-NNNN」'
  , address1 VARCHAR(128) NOT NULL COMMENT '住所1'
  , address2 VARCHAR(128) COMMENT '住所2'
  , tel VARCHAR(16) COMMENT '電話番号'
  , fax VARCHAR(16) COMMENT 'FAX番号'
  , invoice_no CHAR(14) COMMENT 'インボイス登録番号:「T+13桁の数字」－請求書・領収書に出力する場合に設定'
  , financial_code VARCHAR(16) COMMENT '金融機関コード'
  , financial_name VARCHAR(128) COMMENT '金融機関名'
  , branch_code VARCHAR(128) COMMENT '支店コード'
  , branch_name VARCHAR(128) COMMENT '支店名称'
  , account_type CHAR(1) COMMENT '口座種別'
  , account_no VARCHAR(32) COMMENT '口座番号'
  , account_name VARCHAR(128) COMMENT '口座名'
  , health_facility_code_group_id VARCHAR(64) NOT NULL COMMENT '施設コードグループID'
  , created_at TIMESTAMP NULL DEFAULT NULL COMMENT '登録日時'
  , created_by VARCHAR(64) COMMENT '登録ユーザーID'
  , updated_at TIMESTAMP NULL DEFAULT NULL COMMENT '更新日時'
  , updated_by VARCHAR(64) COMMENT '更新ユーザーID'
  , deleted_at TIMESTAMP NULL DEFAULT NULL COMMENT '削除日時'
  , existence boolean as (CASE WHEN deleted_at IS NULL THEN 1 ELSE NULL END) COMMENT '削除有無:1:有効 NULL:論理削除'
  , CONSTRAINT company_PKC PRIMARY KEY (id)
) COMMENT '会社:会社の情報を管理' ;


-- 薬局グループ
CREATE TABLE pharmacy_group (
  id VARCHAR(64) NOT NULL COMMENT 'ID'
  , name VARCHAR(64) NOT NULL COMMENT '名称'
  , name_kana VARCHAR(128) NOT NULL COMMENT 'カナ名称'
  , created_at TIMESTAMP NULL DEFAULT NULL COMMENT '登録日時'
  , created_by VARCHAR(64) COMMENT '登録ユーザーID'
  , updated_at TIMESTAMP NULL DEFAULT NULL COMMENT '更新日時'
  , updated_by VARCHAR(64) COMMENT '更新ユーザーID'
  , deleted_at TIMESTAMP NULL DEFAULT NULL COMMENT '削除日時'
  , existence boolean as (CASE WHEN deleted_at IS NULL THEN 1 ELSE NULL END) COMMENT '削除有無:1:有効 NULL:論理削除'
  , CONSTRAINT pharmacy_group_PKC PRIMARY KEY (id)
) COMMENT '薬局グループ:〇〇薬局というブランドを管理' ;


-- 薬局
CREATE TABLE pharmacy (
  id VARCHAR(64) NOT NULL COMMENT 'ID'
  , company_id VARCHAR(64) NOT NULL COMMENT '会社ID'
  , pharmacy_group_id VARCHAR(64) NOT NULL COMMENT '薬局グループID'
  , name VARCHAR(64) NOT NULL COMMENT '名称:薬局グループと同じだったら表示に工夫が必要'
  , name_kana VARCHAR(128) NOT NULL COMMENT 'カナ名称'
  , medical_institution_code VARCHAR(16) COMMENT '医療機関コード:NSIPSのコード（発行されるまでタイムラグがあるのでNULL許可）'
  , postal_code CHAR(8) NOT NULL COMMENT '郵便番号:ハイフン付き「NNN-NNNN」'
  , address1 VARCHAR(128) NOT NULL COMMENT '住所1'
  , address2 VARCHAR(128) COMMENT '住所2'
  , tel VARCHAR(16) NOT NULL COMMENT '電話番号'
  , fax VARCHAR(16) COMMENT 'FAX番号'
  , created_at TIMESTAMP NULL DEFAULT NULL COMMENT '登録日時'
  , created_by VARCHAR(64) COMMENT '登録ユーザーID'
  , updated_at TIMESTAMP NULL DEFAULT NULL COMMENT '更新日時'
  , updated_by VARCHAR(64) COMMENT '更新ユーザーID'
  , deleted_at TIMESTAMP NULL DEFAULT NULL COMMENT '削除日時'
  , existence boolean as (CASE WHEN deleted_at IS NULL THEN 1 ELSE NULL END) COMMENT '削除有無:1:有効 NULL:論理削除'
  , CONSTRAINT pharmacy_PKC PRIMARY KEY (id)
) COMMENT '薬局:薬局の情報を管理' ;


-- 薬局基本調剤設定
CREATE TABLE pharmacy_base_compounding_setting (
  id VARCHAR(64) NOT NULL COMMENT 'ID'
  , pharmacy_id VARCHAR(64) NOT NULL COMMENT '薬局ID'
  , name VARCHAR(128) NOT NULL COMMENT '名称'
  , score INT NOT NULL COMMENT '点数'
  , start_date DATE NOT NULL COMMENT '開始日'
  , end_date DATE NOT NULL COMMENT '終了日:1年毎の更新らしいので基本は1年後の設定になるはず'
  , created_at TIMESTAMP NULL DEFAULT NULL COMMENT '登録日時'
  , created_by VARCHAR(64) COMMENT '登録ユーザーID'
  , updated_at TIMESTAMP NULL DEFAULT NULL COMMENT '更新日時'
  , updated_by VARCHAR(64) COMMENT '更新ユーザーID'
  , deleted_at TIMESTAMP NULL DEFAULT NULL COMMENT '削除日時'
  , existence boolean as (CASE WHEN deleted_at IS NULL THEN 1 ELSE NULL END) COMMENT '削除有無:1:有効 NULL:論理削除'
  , CONSTRAINT pharmacy_base_compounding_setting_PKC PRIMARY KEY (id)
) COMMENT '薬局基本調剤設定:調剤基本料は薬局ごとに複数指定できるため、別テーブルで管理する' ;


-- 施設関連薬局
CREATE TABLE health_facility_relate_pharmacy (
  id VARCHAR(64) NOT NULL COMMENT 'ID'
  , health_facility_id VARCHAR(64) NOT NULL COMMENT '施設ID'
  , pharmacy_id VARCHAR(64) NOT NULL COMMENT '薬局ID'
  , start_date DATE NOT NULL COMMENT '開始日'
  , end_date DATE DEFAULT '2100-01-01' NOT NULL COMMENT '終了日'
  , note TEXT COMMENT '備考'
  , created_at TIMESTAMP NULL DEFAULT NULL COMMENT '登録日時'
  , created_by VARCHAR(64) COMMENT '登録ユーザーID'
  , updated_at TIMESTAMP NULL DEFAULT NULL COMMENT '更新日時'
  , updated_by VARCHAR(64) COMMENT '更新ユーザーID'
  , deleted_at TIMESTAMP NULL DEFAULT NULL COMMENT '削除日時'
  , existence boolean as (CASE WHEN deleted_at IS NULL THEN 1 ELSE NULL END) COMMENT '削除有無:1:有効 NULL:論理削除'
  , CONSTRAINT health_facility_relate_pharmacy_PKC PRIMARY KEY (id)
) COMMENT '施設関連薬局:薬局が取引する施設を管理' ;


-- 施設
CREATE TABLE health_facility (
  id VARCHAR(64) NOT NULL COMMENT 'ID'
  , code VARCHAR(4) NOT NULL COMMENT 'コード:現在有効な施設コード（担当する店舗が別会社に替わるタイミングでコードが切り替わる可能性がある）'
  , name VARCHAR(64) NOT NULL COMMENT '名称'
  , name_kana VARCHAR(128) NOT NULL COMMENT 'カナ名称'
  , search_name VARCHAR(255) NOT NULL COMMENT '検索用名称:スペースを取り除いた氏名とカナ指名を連結して格納'
  , postal_code CHAR(8) NOT NULL COMMENT '郵便番号:ハイフン付き「NNN-NNNN」'
  , address1 VARCHAR(128) NOT NULL COMMENT '住所1'
  , address2 VARCHAR(128) COMMENT '住所2'
  , tel VARCHAR(16) COMMENT '電話番号'
  , fax VARCHAR(16) COMMENT 'FAX番号'
  , mail VARCHAR(128) COMMENT 'メールアドレス'
  , url VARCHAR(255) COMMENT 'URL'
  , patient_sort_type enum('NAME', 'CODE', 'OTHER') DEFAULT 'NAME' NOT NULL COMMENT '患者ソート種別:NAME=名前順, CODE=患者コード順, OTHER=その他（持っている情報では単純にソートできない場合'
  , note TEXT COMMENT '備考'
  , created_at TIMESTAMP NULL DEFAULT NULL COMMENT '登録日時'
  , created_by VARCHAR(64) COMMENT '登録ユーザーID'
  , updated_at TIMESTAMP NULL DEFAULT NULL COMMENT '更新日時'
  , updated_by VARCHAR(64) COMMENT '更新ユーザーID'
  , deleted_at TIMESTAMP NULL DEFAULT NULL COMMENT '削除日時'
  , existence boolean as (CASE WHEN deleted_at IS NULL THEN 1 ELSE NULL END) COMMENT '削除有無:1:有効 NULL:論理削除'
  , CONSTRAINT health_facility_PKC PRIMARY KEY (id)
) COMMENT '施設:施設の情報を管理' ;


-- 施設コード管理
CREATE TABLE health_facility_code_manage (
  id VARCHAR(64) NOT NULL COMMENT 'ID'
  , health_facility_code_group_id VARCHAR(64) NOT NULL COMMENT '施設コードグループID'
  , health_facility_id VARCHAR(64) NOT NULL COMMENT '施設ID'
  , code VARCHAR(4) NOT NULL COMMENT 'コード'
  , sequence_no INT DEFAULT 0 NOT NULL COMMENT 'シーケンス番号'
  , created_at TIMESTAMP NULL DEFAULT NULL COMMENT '登録日時'
  , created_by VARCHAR(64) COMMENT '登録ユーザーID'
  , updated_at TIMESTAMP NULL DEFAULT NULL COMMENT '更新日時'
  , updated_by VARCHAR(64) COMMENT '更新ユーザーID'
  , deleted_at TIMESTAMP NULL DEFAULT NULL COMMENT '削除日時'
  , existence boolean as (CASE WHEN deleted_at IS NULL THEN 1 ELSE NULL END) COMMENT '削除有無:1:有効 NULL:論理削除'
  , CONSTRAINT health_facility_code_manage_PKC PRIMARY KEY (id)
) COMMENT '施設コード管理:グループごとの施設のコードとその採番のシーケンスを管理' ;
ALTER TABLE health_facility_code_manage ADD UNIQUE health_facility_code_manage_IX1 (health_facility_id,health_facility_code_group_id) ;


-- 患者関連施設
CREATE TABLE patient_relate_health_facility (
  id VARCHAR(64) NOT NULL COMMENT 'ID'
  , patient_id VARCHAR(64) NOT NULL COMMENT '患者ID'
  , health_facility_id VARCHAR(64) NOT NULL COMMENT '施設ID'
  , start_date DATE NOT NULL COMMENT '入居日'
  , end_date DATE DEFAULT '2100-01-01' NOT NULL COMMENT '退居日'
  , reason enum('DECEASE', 'RELOCATION') COMMENT '退居理由:DECEASE: 死亡, RELOCATION: 転居'
  , bill_sort INT COMMENT '請求書ソート順:施設単位での請求書に出力する患者のソート順。施設の患者ソート種別がその他以外はデータ登録時に番号を振りなおして更新する'
  , note TEXT COMMENT '備考'
  , created_at TIMESTAMP NULL DEFAULT NULL COMMENT '登録日時'
  , created_by VARCHAR(64) COMMENT '登録ユーザーID'
  , updated_at TIMESTAMP NULL DEFAULT NULL COMMENT '更新日時'
  , updated_by VARCHAR(64) COMMENT '更新ユーザーID'
  , deleted_at TIMESTAMP NULL DEFAULT NULL COMMENT '削除日時'
  , existence boolean as (CASE WHEN deleted_at IS NULL THEN 1 ELSE NULL END) COMMENT '削除有無:1:有効 NULL:論理削除'
  , CONSTRAINT patient_relate_health_facility_PKC PRIMARY KEY (id)
) COMMENT '患者関連施設:施設が入居する患者を管理' ;


-- 患者
CREATE TABLE patient (
  id VARCHAR(64) NOT NULL COMMENT 'ID'
  , code CHAR(8) NOT NULL COMMENT '患者コード:現在有効な患者コード（施設の移動により切り替わる）'
  , name VARCHAR(64) NOT NULL COMMENT '氏名'
  , name_kana VARCHAR(128) NOT NULL COMMENT 'カナ氏名'
  , search_name VARCHAR(255) NOT NULL COMMENT '検索用氏名:スペースを取り除いた氏名とカナ指名を連結して格納'
  , gender CHAR(1) DEFAULT '0' NOT NULL COMMENT '性別 :0：不明  1：男  2：女'
  , birthday CHAR(8) COMMENT '生年月日'
  , medical_confirm_date DATE COMMENT '医療確認日（仮）:チェックリストの項目'
  , nursing_confirm_date DATE COMMENT '介護確認日（仮）:チェックリストの項目'
  , share_confirm_date DATE COMMENT '負担割合証確認日（仮）:チェックリストの項目'
  , consent_confirm_date DATE COMMENT '同意書確認日（仮）:チェックリストの項目'
  , account_confirm_date DATE COMMENT '口振（仮）:チェックリストの項目'
  , recept_sync_flag BOOL DEFAULT false NOT NULL COMMENT 'レセコン同期フラグ:請求CSVで一致を確認出来たらtrueに変更。転居などで店舗が変わるタイミングでfalseにリセットする必要がある'
  , batch_order_flag BOOL DEFAULT true NOT NULL COMMENT '一括請求フラグ:true: 一括請求, false: 個別請求'
  , billing_name VARCHAR(64) COMMENT '請求先氏名:個人請求の場合は必須'
  , billing_postal_code CHAR(8) COMMENT '請求先郵便番号:ハイフン付き「NNN-NNNN」個人請求の場合は必須'
  , billing_address1 VARCHAR(128) COMMENT '請求先住所1:個人請求の場合は必須'
  , billing_address2 VARCHAR(128) COMMENT '請求先住所2'
  , billing_tel VARCHAR(16) COMMENT '請求先電話番号'
  , payment_type enum('UNDEFINED', 'CASH', 'WITHDRAWAL', 'TRANSFER')  DEFAULT 'UNDEFINED' NOT NULL COMMENT '支払い種別:UNDEFINED: 未確認, CASH: 現金, 2: 引落, 3: 振込'
  , financial_code VARCHAR(16) COMMENT '金融機関コード'
  , financial_name VARCHAR(128) COMMENT '金融機関名'
  , branch_code VARCHAR(8) COMMENT '支店コード'
  , branch_name VARCHAR(128) COMMENT '支店名'
  , account_type enum('NORMAL', 'CURRENT') COMMENT '口座種別:NORMAL: 普通預金, CURRENT: 当座預金'
  , account_no VARCHAR(32) COMMENT '口座番号'
  , account_name VARCHAR(128) COMMENT '口座名'
  , payer_name VARCHAR(128) COMMENT '支払人名'
  , note TEXT COMMENT '備考'
  , created_at TIMESTAMP NULL DEFAULT NULL COMMENT '登録日時'
  , created_by VARCHAR(64) COMMENT '登録ユーザーID'
  , updated_at TIMESTAMP NULL DEFAULT NULL COMMENT '更新日時'
  , updated_by VARCHAR(64) COMMENT '更新ユーザーID'
  , deleted_at TIMESTAMP NULL DEFAULT NULL COMMENT '削除日時'
  , existence boolean as (CASE WHEN deleted_at IS NULL THEN 1 ELSE NULL END) COMMENT '削除有無:1:有効 NULL:論理削除'
  , CONSTRAINT patient_PKC PRIMARY KEY (id)
) COMMENT '患者:患者の基本情報を管理' ;


-- 患者コード履歴
CREATE TABLE patient_code_history (
  id VARCHAR(64) NOT NULL COMMENT 'ID'
  , patient_id VARCHAR(64) NOT NULL COMMENT '患者ID'
  , patient_code VARCHAR(8) NOT NULL COMMENT '患者コード'
  , created_at TIMESTAMP NULL DEFAULT NULL COMMENT '登録日時'
  , created_by VARCHAR(64) COMMENT '登録ユーザーID'
  , updated_at TIMESTAMP NULL DEFAULT NULL COMMENT '更新日時'
  , updated_by VARCHAR(64) COMMENT '更新ユーザーID'
  , deleted_at TIMESTAMP NULL DEFAULT NULL COMMENT '削除日時'
  , existence boolean as (CASE WHEN deleted_at IS NULL THEN 1 ELSE NULL END) COMMENT '削除有無:1:有効 NULL:論理削除'
  , CONSTRAINT patient_code_history_PKC PRIMARY KEY (id)
) COMMENT '患者コード履歴:患者コードの体系は「施設コード（4桁）」＋「各店舗ごとのユニーク番号（4桁）」だが、
施設移動になったり店舗が変更された場合に別店舗で新たに番号が付与されることもある
その際に、元の店舗のコードを変更する運用は存在していないため、同一患者で複数のコードを持つ可能性がある' ;


-- 患者ファイル
CREATE TABLE patient_file (
  id VARCHAR(64) NOT NULL COMMENT 'ID'
  , patient_id VARCHAR(64) NOT NULL COMMENT '患者ID'
  , title VARCHAR(64) NOT NULL COMMENT 'タイトル:「同意書」とかそのファイルを表す名称'
  , file_path VARCHAR(255) NOT NULL COMMENT 'ファイルパス'
  , note TEXT COMMENT '備考'
  , created_at TIMESTAMP NULL DEFAULT NULL COMMENT '登録日時'
  , created_by VARCHAR(64) COMMENT '登録ユーザーID'
  , updated_at TIMESTAMP NULL DEFAULT NULL COMMENT '更新日時'
  , updated_by VARCHAR(64) COMMENT '更新ユーザーID'
  , deleted_at TIMESTAMP NULL DEFAULT NULL COMMENT '削除日時'
  , existence boolean as (CASE WHEN deleted_at IS NULL THEN 1 ELSE NULL END) COMMENT '削除有無:1:有効 NULL:論理削除'
  , CONSTRAINT patient_file_PKC PRIMARY KEY (id)
) COMMENT '患者ファイル:患者に関連するファイルを管理' ;


-- 患者変更履歴
CREATE TABLE patient_change_history (
  id VARCHAR(64) NOT NULL COMMENT 'ID'
  , patient_id VARCHAR(64) NOT NULL COMMENT '患者ID'
  , created_at TIMESTAMP NULL DEFAULT NULL COMMENT '登録日時'
  , created_by VARCHAR(64) COMMENT '登録ユーザーID'
  , updated_at TIMESTAMP NULL DEFAULT NULL COMMENT '更新日時'
  , updated_by VARCHAR(64) COMMENT '更新ユーザーID'
  , deleted_at TIMESTAMP NULL DEFAULT NULL COMMENT '削除日時'
  , existence boolean as (CASE WHEN deleted_at IS NULL THEN 1 ELSE NULL END) COMMENT '削除有無:1:有効 NULL:論理削除'
  , CONSTRAINT patient_change_history_PKC PRIMARY KEY (id)
) COMMENT '患者変更履歴:患者情報の変更の単位でレコードを作成' ;


-- 患者変更内容
CREATE TABLE patient_change_content (
  id VARCHAR(64) NOT NULL COMMENT 'ID'
  , patient_change_history_id VARCHAR(64) NOT NULL COMMENT '患者変更履歴ID'
  , item_name VARCHAR(64) NOT NULL COMMENT '項目名'
  , before_value VARCHAR(255) COMMENT '変更前の値'
  , after_value VARCHAR(255) COMMENT '変更後の値'
  , created_at TIMESTAMP NULL DEFAULT NULL COMMENT '登録日時'
  , created_by VARCHAR(64) COMMENT '登録ユーザーID'
  , updated_at TIMESTAMP NULL DEFAULT NULL COMMENT '更新日時'
  , updated_by VARCHAR(64) COMMENT '更新ユーザーID'
  , deleted_at TIMESTAMP NULL DEFAULT NULL COMMENT '削除日時'
  , existence boolean as (CASE WHEN deleted_at IS NULL THEN 1 ELSE NULL END) COMMENT '削除有無:1:有効 NULL:論理削除'
  , CONSTRAINT patient_change_content_PKC PRIMARY KEY (id)
) COMMENT '患者変更内容:患者情報で変更された内容を管理（備考は対象外？）' ;


-- 問い合わせ
CREATE TABLE inquiry (
  id VARCHAR(64) NOT NULL COMMENT 'ID'
  , title VARCHAR(64) NOT NULL COMMENT 'タイトル'
  , content TEXT NOT NULL COMMENT '問い合わせ内容'
  , status enum('open', 'operation', 'reject', 'close') DEFAULT 'open' NOT NULL COMMENT 'ステータス:open: 起票, operation: 対応中, reject: 却下, close: 終了'
  , patient_id VARCHAR(64) NOT NULL COMMENT '患者ID'
  , pharrmacy_id VARCHAR(64) COMMENT '受付薬局ID'
  , created_at TIMESTAMP NULL DEFAULT NULL COMMENT '登録日時'
  , created_by VARCHAR(64) COMMENT '登録ユーザーID'
  , updated_at TIMESTAMP NULL DEFAULT NULL COMMENT '更新日時'
  , updated_by VARCHAR(64) COMMENT '更新ユーザーID'
  , deleted_at TIMESTAMP NULL DEFAULT NULL COMMENT '削除日時'
  , existence boolean as (CASE WHEN deleted_at IS NULL THEN 1 ELSE NULL END) COMMENT '削除有無:1:有効 NULL:論理削除'
  , CONSTRAINT inquiry_PKC PRIMARY KEY (id)
) COMMENT '問い合わせ:問い合わせ情報を管理' ;


-- 問い合わせ対応
CREATE TABLE inquiry_correspond (
  id VARCHAR(64) NOT NULL COMMENT 'ID'
  , inquiry_id VARCHAR(64) NOT NULL COMMENT '問い合わせID'
  , content TEXT NOT NULL COMMENT '対応内容'
  , user_name VARCHAR(64) COMMENT '対応者名:店舗は個人にユーザーが存在しないため、任意で名前を入力'
  , created_at TIMESTAMP NULL DEFAULT NULL COMMENT '登録日時'
  , created_by VARCHAR(64) COMMENT '登録ユーザーID'
  , updated_at TIMESTAMP NULL DEFAULT NULL COMMENT '更新日時'
  , updated_by VARCHAR(64) COMMENT '更新ユーザーID'
  , deleted_at TIMESTAMP NULL DEFAULT NULL COMMENT '削除日時'
  , existence boolean as (CASE WHEN deleted_at IS NULL THEN 1 ELSE NULL END) COMMENT '削除有無:1:有効 NULL:論理削除'
  , CONSTRAINT inquiry_correspond_PKC PRIMARY KEY (id)
) COMMENT '問い合わせ対応:問い合わせに対する対応を管理' ;


-- 問い合わせ添付ファイル
CREATE TABLE inquiry_file (
  id VARCHAR(64) NOT NULL COMMENT 'ID'
  , correspond_id VARCHAR(64) NOT NULL COMMENT '対応ID'
  , file_path VARCHAR(255) NOT NULL COMMENT 'ファイルパス'
  , created_at TIMESTAMP NULL DEFAULT NULL COMMENT '登録日時'
  , created_by VARCHAR(64) COMMENT '登録ユーザーID'
  , updated_at TIMESTAMP NULL DEFAULT NULL COMMENT '更新日時'
  , updated_by VARCHAR(64) COMMENT '更新ユーザーID'
  , deleted_at TIMESTAMP NULL DEFAULT NULL COMMENT '削除日時'
  , existence boolean as (CASE WHEN deleted_at IS NULL THEN 1 ELSE NULL END) COMMENT '削除有無:1:有効 NULL:論理削除'
  , CONSTRAINT inquiry_file_PKC PRIMARY KEY (id)
) COMMENT '問い合わせ添付ファイル' ;


/* ----------------------------------------------------------------------------
 * 外部キー作成
 * --------------------------------------------------------------------------*/
-- 施設コードグループ
ALTER TABLE health_facility_code_group
  ADD CONSTRAINT health_facility_code_group_FK1 FOREIGN KEY (created_by) REFERENCES user(id);
ALTER TABLE health_facility_code_group
  ADD CONSTRAINT health_facility_code_group_FK2 FOREIGN KEY (updated_by) REFERENCES user(id);

-- 会社
ALTER TABLE company
  ADD CONSTRAINT company_FK1 FOREIGN KEY (health_facility_code_group_id) REFERENCES health_facility_code_group(id);
ALTER TABLE company
  ADD CONSTRAINT company_FK2 FOREIGN KEY (created_by) REFERENCES user(id);
ALTER TABLE company
  ADD CONSTRAINT company_FK3 FOREIGN KEY (updated_by) REFERENCES user(id);

-- 薬局グループ
ALTER TABLE pharmacy_group
  ADD CONSTRAINT pharmacy_group_FK1 FOREIGN KEY (created_by) REFERENCES user(id);
ALTER TABLE pharmacy_group
  ADD CONSTRAINT pharmacy_group_FK2 FOREIGN KEY (updated_by) REFERENCES user(id);

-- 薬局
ALTER TABLE pharmacy
  ADD CONSTRAINT pharmacy_FK1 FOREIGN KEY (pharmacy_group_id) REFERENCES pharmacy_group(id);
ALTER TABLE pharmacy
  ADD CONSTRAINT pharmacy_FK2 FOREIGN KEY (company_id) REFERENCES company(id);
ALTER TABLE pharmacy
  ADD CONSTRAINT pharmacy_FK3 FOREIGN KEY (created_by) REFERENCES user(id);
ALTER TABLE pharmacy
  ADD CONSTRAINT pharmacy_FK4 FOREIGN KEY (updated_by) REFERENCES user(id);

-- 薬局基本調剤設定
ALTER TABLE pharmacy_base_compounding_setting
  ADD CONSTRAINT pharmacy_base_compounding_setting_FK1 FOREIGN KEY (pharmacy_id) REFERENCES pharmacy(id);
ALTER TABLE pharmacy_base_compounding_setting
  ADD CONSTRAINT pharmacy_base_compounding_setting_FK2 FOREIGN KEY (created_by) REFERENCES user(id);
ALTER TABLE pharmacy_base_compounding_setting
  ADD CONSTRAINT pharmacy_base_compounding_setting_FK3 FOREIGN KEY (updated_by) REFERENCES user(id);

-- 施設関連薬局
ALTER TABLE health_facility_relate_pharmacy
  ADD CONSTRAINT health_facility_relate_pharmacy_FK1 FOREIGN KEY (health_facility_id) REFERENCES health_facility(id);
ALTER TABLE health_facility_relate_pharmacy
  ADD CONSTRAINT health_facility_relate_pharmacy_FK2 FOREIGN KEY (pharmacy_id) REFERENCES pharmacy(id);
ALTER TABLE health_facility_relate_pharmacy
  ADD CONSTRAINT health_facility_relate_pharmacy_FK3 FOREIGN KEY (created_by) REFERENCES user(id);
ALTER TABLE health_facility_relate_pharmacy
  ADD CONSTRAINT health_facility_relate_pharmacy_FK4 FOREIGN KEY (updated_by) REFERENCES user(id);

-- 施設
ALTER TABLE health_facility
  ADD CONSTRAINT health_facility_FK1 FOREIGN KEY (created_by) REFERENCES user(id);
ALTER TABLE health_facility
  ADD CONSTRAINT health_facility_FK2 FOREIGN KEY (updated_by) REFERENCES user(id);

-- 施設コード管理
ALTER TABLE health_facility_code_manage
  ADD CONSTRAINT health_facility_code_manage_FK1 FOREIGN KEY (health_facility_id) REFERENCES health_facility(id);
ALTER TABLE health_facility_code_manage
  ADD CONSTRAINT health_facility_code_manage_FK2 FOREIGN KEY (health_facility_code_group_id) REFERENCES health_facility_code_group(id);
ALTER TABLE health_facility_code_manage
  ADD CONSTRAINT health_facility_code_manage_FK3 FOREIGN KEY (created_by) REFERENCES user(id);
ALTER TABLE health_facility_code_manage
  ADD CONSTRAINT health_facility_code_manage_FK4 FOREIGN KEY (updated_by) REFERENCES user(id);

-- 患者関連施設
ALTER TABLE patient_relate_health_facility
  ADD CONSTRAINT patient_relate_health_facility_FK1 FOREIGN KEY (health_facility_id) REFERENCES health_facility(id);
ALTER TABLE patient_relate_health_facility
  ADD CONSTRAINT patient_relate_health_facility_FK2 FOREIGN KEY (patient_id) REFERENCES patient(id);
ALTER TABLE patient_relate_health_facility
  ADD CONSTRAINT patient_relate_health_facility_FK3 FOREIGN KEY (created_by) REFERENCES user(id);
ALTER TABLE patient_relate_health_facility
  ADD CONSTRAINT patient_relate_health_facility_FK4 FOREIGN KEY (updated_by) REFERENCES user(id);

-- 患者
ALTER TABLE patient
  ADD CONSTRAINT patient_FK1 FOREIGN KEY (created_by) REFERENCES user(id);
ALTER TABLE patient
  ADD CONSTRAINT patient_FK2 FOREIGN KEY (updated_by) REFERENCES user(id);

-- 患者コード履歴
ALTER TABLE patient_code_history
  ADD CONSTRAINT patient_code_history_FK1 FOREIGN KEY (patient_id) REFERENCES patient(id);
ALTER TABLE patient_code_history
  ADD CONSTRAINT patient_code_history_FK2 FOREIGN KEY (created_by) REFERENCES user(id);
ALTER TABLE patient_code_history
  ADD CONSTRAINT patient_code_history_FK3 FOREIGN KEY (updated_by) REFERENCES user(id);

-- 患者ファイル
ALTER TABLE patient_file
  ADD CONSTRAINT patient_file_FK1 FOREIGN KEY (patient_id) REFERENCES patient(id);
ALTER TABLE patient_file
  ADD CONSTRAINT patient_file_FK2 FOREIGN KEY (created_by) REFERENCES user(id);
ALTER TABLE patient_file
  ADD CONSTRAINT patient_file_FK3 FOREIGN KEY (updated_by) REFERENCES user(id);

-- 患者変更履歴
ALTER TABLE patient_change_history
  ADD CONSTRAINT patient_change_history_FK1 FOREIGN KEY (patient_id) REFERENCES patient(id);
ALTER TABLE patient_change_history
  ADD CONSTRAINT patient_change_history_FK2 FOREIGN KEY (created_by) REFERENCES user(id);
ALTER TABLE patient_change_history
  ADD CONSTRAINT patient_change_history_FK3 FOREIGN KEY (updated_by) REFERENCES user(id);

-- 患者変更内容
ALTER TABLE patient_change_content
  ADD CONSTRAINT patient_change_content_FK1 FOREIGN KEY (patient_change_history_id) REFERENCES patient_change_history(id);
ALTER TABLE patient_change_content
  ADD CONSTRAINT patient_change_content_FK2 FOREIGN KEY (created_by) REFERENCES user(id);
ALTER TABLE patient_change_content
  ADD CONSTRAINT patient_change_content_FK3 FOREIGN KEY (updated_by) REFERENCES user(id);

-- 問い合わせ
ALTER TABLE inquiry
  ADD CONSTRAINT inquiry_FK1 FOREIGN KEY (patient_id) REFERENCES patient(id);
ALTER TABLE inquiry
  ADD CONSTRAINT inquiry_FK2 FOREIGN KEY (created_by) REFERENCES user(id);
ALTER TABLE inquiry
  ADD CONSTRAINT inquiry_FK3 FOREIGN KEY (updated_by) REFERENCES user(id);

-- 問い合わせ対応
ALTER TABLE inquiry_correspond
  ADD CONSTRAINT inquiry_correspond_FK1 FOREIGN KEY (inquiry_id) REFERENCES inquiry(id);
ALTER TABLE inquiry_correspond
  ADD CONSTRAINT inquiry_correspond_FK2 FOREIGN KEY (created_by) REFERENCES user(id);
ALTER TABLE inquiry_correspond
  ADD CONSTRAINT inquiry_correspond_FK3 FOREIGN KEY (updated_by) REFERENCES user(id);

-- 問い合わせファイル
ALTER TABLE inquiry_file
  ADD CONSTRAINT inquiry_file_FK1 FOREIGN KEY (correspond_id) REFERENCES inquiry_correspond(id);
ALTER TABLE inquiry_file
  ADD CONSTRAINT inquiry_file_FK2 FOREIGN KEY (created_by) REFERENCES user(id);
ALTER TABLE inquiry_file
  ADD CONSTRAINT inquiry_file_FK3 FOREIGN KEY (updated_by) REFERENCES user(id);


/* ----------------------------------------------------------------------------
 * 初期データ登録
 * --------------------------------------------------------------------------*/
-- ユーザー
insert into user
  (id, user_type, mail, name, password, created_at, created_by, updated_at, updated_by)
values
  ('0000000000000000000U0001', 'ADMIN', 'admin@test', '管理者', 'test', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001');

-- 施設コードグループ
insert into health_facility_code_group
  (id, name, format_type, created_at, created_by, updated_at, updated_by)
values
  ('00000000000000000FCG0001', '基本形式（グリーン）', 'SIMPLE', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCG0002', '前ゼロ埋め（エフレ）', 'PADDING', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001');

-- 会社
insert into company
  (id, name, name_kana, postal_code, address1, address2, tel, fax, health_facility_code_group_id, created_at, created_by, updated_at, updated_by)
values
  ('0000000000000000000C0001', '株式会社グリーンエイト', 'グリーンエイト', '163-0437', '東京都新宿区西新宿2-1-1', '新宿三井ビルディング37階', '03-6279-2799', '03-6279-2793','00000000000000000FCG0001', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('0000000000000000000C0002', 'メディカルエフレ株式会社', 'メディカルエフレ', '163-0437', '東京都新宿区西新宿2-1-1', '新宿三井ビルディング37階', '03-6279-2812', '03-6279-2817','00000000000000000FCG0001', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('0000000000000000000C0003', '株式会社リンクス', 'リンクス', '163-0437', '東京都新宿区西新宿2-1-1', '新宿三井ビルディング37階', '', null,'00000000000000000FCG0002', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('0000000000000000000C0004', '株式会社メディカルアメニティ', 'メディカルアメニティ', '000-0000', '〇〇県□□市△△町1-1', null, '', null,'00000000000000000FCG0001', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001');

-- 薬局グループ
insert into pharmacy_group
  (id, name, name_kana, created_at, created_by, updated_at, updated_by)
values
  ('0000000000000000000G0001', 'セントラル薬局', 'セントラル' , '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('0000000000000000000G0002', 'ひまわり薬局', 'ヒマワリ' , '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('0000000000000000000G0003', 'オリーブ薬局', 'オリーブ' , '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('0000000000000000000G0004', 'リンクス薬局', 'リンクス' , '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001');

-- 薬局
insert into pharmacy
  (id, company_id, pharmacy_group_id, name, name_kana, medical_institution_code, postal_code, address1, address2, tel, fax, created_at, created_by, updated_at, updated_by)
values
  ('0000000000000000000P0001', '0000000000000000000C0001','0000000000000000000G0001', '浦和店', 'ウラワ', null, '338-0837', '埼玉県さいたま市桜区田島5-21-13', '三光西浦和ビル2階', '048-711-4068', '048-711-4069', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('0000000000000000000P0002', '0000000000000000000C0001','0000000000000000000G0001', '武蔵浦和店', 'ムサシウラワ', null, '336-0021', '埼玉県さいたま市南区別所6-15-12', null, '048-826-6378', '048-826-6379', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('0000000000000000000P0003', '0000000000000000000C0001','0000000000000000000G0001', '永福店', 'エイフク', null, '168-0064', '東京都杉並区永福4-18-5', 'フェリーチェ杉並1階', '03-6379-4988', '03-6379-4989', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('0000000000000000000P0004', '0000000000000000000C0001','0000000000000000000G0001', '練馬店', 'ネリマ', null, '178-0062', '東京都練馬区大泉町3-2-9', null, '03-6904-4581', '03-6904-4681', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('0000000000000000000P0005', '0000000000000000000C0001','0000000000000000000G0001', '蕨店', 'ワラビ', null, '335-0004', '埼玉県蕨市中央2-3-10', null, '048-299-5157', '048-299-5158', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('0000000000000000000P0006', '0000000000000000000C0001','0000000000000000000G0001', '川崎梶が谷店', 'カワサキカジガヤ', null, '213-0033', '神奈川県川崎市高津区下作延3-22-1', null, '044-789-8025', '044-789-8026', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('0000000000000000000P0007', '0000000000000000000C0001','0000000000000000000G0001', '横浜仲町台店', 'ヨコハマナカマチ', '3840444', '224-0041', '神奈川県横浜市都筑区仲町台5-5-1', 'リンデンハイム仲町台1Ｆ', '045-482-4296', '045-482-4297', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('0000000000000000000P0008', '0000000000000000000C0001','0000000000000000000G0001', '武蔵小杉店', 'ムサシコスギ', null, '211-0005', '神奈川県川崎市中原区新丸子町727-3', 'リバービューハイツ201', '044-299-8595', '044-299-8596', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('0000000000000000000P0009', '0000000000000000000C0001','0000000000000000000G0002', '所沢店', 'トコロザワ', null, '359-1155', '埼玉県所沢市北野新町2-19-11', null, '04-2941-6948', '04-2941-6949', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('0000000000000000000P0010', '0000000000000000000C0001','0000000000000000000G0002', '東所沢店', 'ヒガシトコロザワ', null, '359-0022', '埼玉県所沢市本郷270-5', null, '04-2945-9999', '04-2945-9988', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('0000000000000000000P0011', '0000000000000000000C0001','0000000000000000000G0002', '狭山ヶ丘店', 'サヤマガオカ', null, '359-1161', '埼玉県所沢市狭山ケ丘1-3009-15', null, '04-2968-9468', '04-2968-9469', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('0000000000000000000P0012', '0000000000000000000C0002','0000000000000000000G0003', '西浦和店', 'ニシウラワ', null, '338-0837', '埼玉県さいたま市桜区田島5-21-13', '三光西浦和ビル1階', '048-767-4774', '048-767-4773', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('0000000000000000000P0013', '0000000000000000000C0002','0000000000000000000G0003', '大宮大成店', 'オオミヤオオナリ', null, '330-0852', '埼玉県さいたま市大宮区大成町3-245-2', null, '048-788-4333', '048-788-4334', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('0000000000000000000P0014', '0000000000000000000C0003','0000000000000000000G0004', 'リンクス薬局', 'リンクス', null, '212-0053', '神奈川県川崎市幸区下平間242', null, '044-511-1866', '044-511-1867', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('0000000000000000000P0015', '0000000000000000000C0004','0000000000000000000G0001', '渋谷店', 'シブヤ', '1355445', '150-0002', '東京都渋谷区渋谷1-22-4', null, '03-5466-1710', null, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001');

-- 施設
insert into health_facility
  (id, name, name_kana, search_name, code, postal_code, address1, address2, tel, fax, created_at, created_by, updated_at, updated_by, deleted_at)
values
  ('0000000000000000000F0001', 'プラチナシニアホーム高島平', 'プラチナシニアホ-ムタカシマダイラ', 'プラチナシニアホーム高島平プラチナシニアホ-ムタカシマダイラ', '0001', '175-0081', '東京都板橋区新河岸3-11-11', null, '03-5968-3337', '03-5968-3338', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001','2023-10-01 00:00:00'),
  ('0000000000000000000F0002', 'イリ－ゼ浦和大門', 'イリ－ゼウラワダイモン', 'イリ－ゼ浦和大門イリ－ゼウラワダイモン', '0002', '336-0963', '埼玉県さいたま市緑区大門808', null, '048-812-1206', '048-812-1208', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001','2023-10-01 00:00:00'),
  ('0000000000000000000F0003', 'ニチイケアセンター武蔵浦和', 'ニチイケアセンタームサシウラワ', 'ニチイケアセンター武蔵浦和ニチイケアセンタームサシウラワ', '0003', '336-0026', '埼玉県さいたま市南区辻4丁目19番13号', null, '048-710-5201', '048-710-5202', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0004', 'ヒューマンライフケア見沼グループホーム', 'ヒューマンライフケアミヌマグループホーム', 'ヒューマンライフケア見沼グループホームヒューマンライフケアミヌマグループホーム', '0004', '337-0042', '埼玉県さいたま市見沼区南中野1038-1', null, '048-615-0383', '048-615-1165', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0005', 'イリ－ゼ南流山', 'イリ－ゼミナミナガレヤマ', 'イリ－ゼ南流山イリ－ゼミナミナガレヤマ', '0005', '270-0162', '千葉県流山市木117-1', null, '047-157-6201', '047-157-6202', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001','2023-10-01 00:00:00'),
  ('0000000000000000000F0006', 'ヒュ－マンライフケア鳩ヶ谷の郷', 'ヒュ－マンライフケアハトガヤノサト', 'ヒュ－マンライフケア鳩ヶ谷の郷ヒュ－マンライフケアハトガヤノサト', '0006', '334-0002', '埼玉県川口市鳩ケ谷本町3-24-8', null, '048-287-7337', '048-283-1366', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0007', '愛グループホーム板橋ときわ台', 'アイグループホームイタバシトキワダイ', '愛グループホーム板橋ときわ台アイグループホームイタバシトキワダイ', '0007', '174-0072', '東京都板橋区南常盤台1-20-14', null, '03-3972-5595', '03-3972-5596', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0008', 'イリ－ゼ八潮', 'イリ－ゼヤシオ', 'イリ－ゼ八潮イリ－ゼヤシオ', '0008', '340-0815', '埼玉県八潮市八潮1-27-6', null, '048-996-3631', '048-996-3632', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001','2023-10-01 00:00:00'),
  ('0000000000000000000F0009', 'イリーゼ大宮櫛引', 'イリーゼオオミヤクシヒキ', 'イリーゼ大宮櫛引イリーゼオオミヤクシヒキ', '0009', '330-0851', '埼玉県さいたま市大宮区櫛引町1-127-1', null, '048-661-5761', '048-661-5762', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001','2023-10-01 00:00:00'),
  ('0000000000000000000F0010', 'イリ－ゼよしかわ', 'イリ－ゼヨシカワ', 'イリ－ゼよしかわイリ－ゼヨシカワ', '0010', '342-0038', '埼玉県吉川市美南4-18-3', null, '048-984-0770', '048-984-0772', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001','2023-10-01 00:00:00'),
  ('0000000000000000000F0011', 'ヒューマンライフケア浦和の樹', 'ヒューマンライフケアウラワノキ', 'ヒューマンライフケア浦和の樹ヒューマンライフケアウラワノキ', '0011', '330-0055', '埼玉県さいたま市浦和区高砂町4-1', null, '048-811-1865', '048-881-7700', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0012', 'イリーゼ川口宮町', 'イリーゼカワグチミヤチョウ', 'イリーゼ川口宮町イリーゼカワグチミヤチョウ', '0012', '332-0028', '埼玉県川口市宮町16番12号', null, '048-240-6151', '048-240-6152', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001','2023-10-01 00:00:00'),
  ('0000000000000000000F0013', 'ニチイケアセンター練馬さくら台', 'ニチイケアセンターネリマサクラダイ', 'ニチイケアセンター練馬さくら台ニチイケアセンターネリマサクラダイ', '0013', '176-0002', '東京都練馬区桜台2-28-5', null, '03-5912-1563', '03-5912-1564', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0014', 'サニ－ライフ越谷', 'サニ－ライフコシガヤ', 'サニ－ライフ越谷サニ－ライフコシガヤ', '0014', '343-0807', '埼玉県越谷市赤山町3-197-1', null, '048-969-2700', '048-962-3603', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001','2023-10-01 00:00:00'),
  ('0000000000000000000F0015', 'サニーライフ西川口', 'サニーライフニシカワグチ', 'サニーライフ西川口サニーライフニシカワグチ', '0015', '332-0021', '埼玉県川口市西川口4-16-5', null, '048-259-3600', '048-259-3603', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001','2023-10-01 00:00:00'),
  ('0000000000000000000F0016', 'サニ－ライフ越谷北', 'サニ－ライフコシガヤキタ', 'サニ－ライフ越谷北サニ－ライフコシガヤキタ', '0016', '343-0032', '埼玉県越谷市大字袋山249-1', null, '048-970-3600', '048-970-3601', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001','2023-10-01 00:00:00'),
  ('0000000000000000000F0017', 'ニチイケセンター浦和東', 'ニチイケアセンターウラワヒガシ', 'ニチイケセンター浦和東ニチイケアセンターウラワヒガシ', '0017', '336-0926', '埼玉県さいたま市緑区東浦和7丁目41-5', null, '048-810-6150', '048-810-6151', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0018', 'イリ－ゼ中浦和', 'イリ－ゼナカウラワ', 'イリ－ゼ中浦和イリ－ゼナカウラワ', '0018', '336-0031', '埼玉県さいたま市南区鹿手袋2-6-20', null, '048-710-8801', '048-710-8802', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001','2023-10-01 00:00:00'),
  ('0000000000000000000F0019', 'プラチナシニアホーム板橋徳丸弐番館', 'プラチナシニアホームイタバシトクマルニバンカン', 'プラチナシニアホーム板橋徳丸弐番館プラチナシニアホームイタバシトクマルニバンカン', '0019', '175-0083', '東京都板橋区徳丸5-29-16', null, '03-6906-8103', '03-6906-8104', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001','2023-10-01 00:00:00'),
  ('0000000000000000000F0020', 'グル－プホームイリ－ゼ浦和さいど', 'グル－プホ―ムイリ－ゼウラワサイド', 'グル－プホームイリ－ゼ浦和さいどグル－プホ―ムイリ－ゼウラワサイド', '0020', '336-0907', '埼玉県さいたま市緑区道祖土2-12-15', null, '048-811-2061', '048-811-2062', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001','2023-10-01 00:00:00'),
  ('0000000000000000000F0021', 'ニチイケアセンター川口北', 'ニチケアセンターカワグチキタ', 'ニチイケアセンター川口北ニチケアセンターカワグチキタ', '0021', '333-0816', '埼玉県川口市大字差間324番地の1', null, '048-290-2555', '048-295-7806', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0022', 'イリ－ゼ川口安行', 'イリ－ゼカワグチアンギョウ', 'イリ－ゼ川口安行イリ－ゼカワグチアンギョウ', '0022', '334-0059', '埼玉県川口市安行92-1', null, '048-291-7707', '048-291-7708', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001','2023-10-01 00:00:00'),
  ('0000000000000000000F0023', 'アズハイム南浦和', 'アズハイムミナミウラワ', 'アズハイム南浦和アズハイムミナミウラワ', '0023', '336-0025', '埼玉県さいたま市南区文蔵3-31-12', null, '048-710-9330', '048-710-9332', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0024', 'アズハイム中浦和', 'アズハイムナカウラワ', 'アズハイム中浦和アズハイムナカウラワ', '0024', '338-0832', '埼玉県さいたま市桜区西堀2-21-9', null, '048-837-1590', '048-837-1591', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0025', 'サニーライフ練馬', 'サニーライフネリマ', 'サニーライフ練馬サニーライフネリマ', '0025', '179-0075', '東京都練馬区高松3-5-19', null, '03-3825-2700', '03-3825-2701', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001','2023-10-01 00:00:00'),
  ('0000000000000000000F0026', 'アズハイム東浦和', 'アズハイムヒガシウラワ', 'アズハイム東浦和アズハイムヒガシウラワ', '0026', '336-0926', '埼玉県さいたま市緑区東浦和2-22-3', null, '048-876-5880', '048-876-5882', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0027', 'もみの樹・練馬', 'モミノキネリマ', 'もみの樹・練馬モミノキネリマ', '0027', '179-0083', '東京都練馬区平和台2-50-1', null, '03-5921-1005', '03-5921-1006', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0028', 'アズハイム三郷', 'アズハイムミサト', 'アズハイム三郷アズハイムミサト', '0028', '341-0054', '埼玉県三郷市泉131', null, '048-953-7181', '048-953-7182', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0029', 'プラチナシニアホーム西東京ひばりヶ丘', 'プラチナシニアホームニシトウキョウヒバリガオカ', 'プラチナシニアホーム西東京ひばりヶ丘プラチナシニアホームニシトウキョウヒバリガオカ', '0029', '202-0003', '東京都西東京市北町2-1-1', null, '042-439-8735', '042-439-8737', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001','2023-10-01 00:00:00'),
  ('0000000000000000000F0030', 'イリ－ゼ北越谷', 'イリ－ゼキタコシガヤ', 'イリ－ゼ北越谷イリ－ゼキタコシガヤ', '0030', '343-0035', '埼玉県越谷市大字大道53-1', null, '048-970-1031', '048-970-1032', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001','2023-10-01 00:00:00'),
  ('0000000000000000000F0031', 'ニチイケアセンター戸田笹目', 'ニチイケアセンタートダササメ', 'ニチイケアセンター戸田笹目ニチイケアセンタートダササメ', '0031', '335-0005', '埼玉県戸田市笹目南町33-13', null, '048-449-6531', '048-421-3778', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0032', 'サニ－ライフ三郷中央', 'サニ－ライフミサトチュウオウ', 'サニ－ライフ三郷中央サニ－ライフミサトチュウオウ', '0032', '341-0038', '埼玉県三郷市中央3-20-7', null, '048-953-3600', '048-953-3613', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001','2023-10-01 00:00:00'),
  ('0000000000000000000F0033', 'イリーゼ西大宮', 'イリーゼニシオオミヤ', 'イリーゼ西大宮イリーゼニシオオミヤ', '0033', '331-0052', '埼玉県さいたま市西区三橋6丁目1235番1', null, '048-620-5011', '048-620-5012', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001','2023-10-01 00:00:00'),
  ('0000000000000000000F0034', 'クラ－チエレガンタ本郷', 'クラ－チエレガンタホンゴウ', 'クラ－チエレガンタ本郷クラ－チエレガンタホンゴウ', '0034', '113-0023', '東京都文京区向丘2-2-6', null, '03-5689-8781', '03-5689-8785', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0035', 'イリーゼ戸田', 'イリーゼトダ', 'イリーゼ戸田イリーゼトダ', '0035', '335-0005', '埼玉県蕨市錦町4-7-4', null, '048-430-0321', '048-430-0322', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001','2023-10-01 00:00:00'),
  ('0000000000000000000F0036', 'センチュリーハウス武蔵浦和', 'センチュリーハウスムサシウラワ', 'センチュリーハウス武蔵浦和センチュリーハウスムサシウラワ', '0036', '336-0031', '埼玉県さいたま市南区鹿手袋4-32-30', null, '048-710-5710', '048-710-5712', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0037', 'ホスピタルメント板橋ときわ台', 'ホスピタルメントイタバシトキワダイ', 'ホスピタルメント板橋ときわ台ホスピタルメントイタバシトキワダイ', '0037', '174-0063', '東京都板橋区前野町3-20-2', null, '03-6279-8851', '03-6279-8854', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0038', 'トミオさいたま桜テラス', 'トミオサイタマサクラテラス', 'トミオさいたま桜テラストミオサイタマサクラテラス', '0038', '331-0802', '埼玉県さいたま市北区本郷町460', null, '048-776-9302', '048-776-9304', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0039', 'プラチナシニアホーム板橋徳丸', 'プラチナシニアホームイタバシトクマル', 'プラチナシニアホーム板橋徳丸プラチナシニアホームイタバシトクマル', '0039', '175-0083', '東京都板橋区徳丸3-38-19', null, '03-5922-1305', '03-5922-1306', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001','2023-10-01 00:00:00'),
  ('0000000000000000000F0040', 'きらら春日部', 'キララカスカベ', 'きらら春日部キララカスカベ', '0040', '344-0054', '埼玉県春日部市浜川戸1-5-10', null, '048-753-3000', '048-752-3000', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0041', '愛グル－プホ－ム潮止', 'アイグル－プホ－ムシオドメ', '愛グル－プホ－ム潮止アイグル－プホ－ムシオドメ', '0041', '340-0814', '埼玉県八潮市南川崎455-2', null, '048-950-8875', '048-950-8876', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0042', 'イリ－ゼ朝霞', 'イリ－ゼアサカ', 'イリ－ゼ朝霞イリ－ゼアサカ', '0042', '351-0011', '埼玉県朝霞市本町1-38-7', null, '048-451-3301', '048-451-3302', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001','2023-10-01 00:00:00'),
  ('0000000000000000000F0043', '大宮東ケアパークそよ風', 'オオミヤヒガシケアパークソヨカゼ', '大宮東ケアパークそよ風オオミヤヒガシケアパークソヨカゼ', '0043', '337-0042', '埼玉県さいたま市見沼区浜川戸1-5-10', null, '048-681-5130', '048-681-5131', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0044', '志木シルバ－ハイツ', 'シキシルバ－ハイツ', '志木シルバ－ハイツシキシルバ－ハイツ', '0044', '354-0017', '埼玉県富士見市鉢ヶ谷1-15-24', null, '049-252-2515', '049-255-5834', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001','2023-10-01 00:00:00'),
  ('0000000000000000000F0045', 'サニーライフ与野本町', 'サニーライフヨノホンマチ', 'サニーライフ与野本町サニーライフヨノホンマチ', '0045', '338-0007', '埼玉県さいたま市中央区円阿弥4-7-21', null, '048-859-3600', '048-859-3608', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001','2023-10-01 00:00:00'),
  ('0000000000000000000F0046', 'アズハイム練馬ガーデン', 'アズハイムネリマガーデン', 'アズハイム練馬ガーデンアズハイムネリマガーデン', '0046', '179-0073', '東京都練馬区田柄2-34-7', null, '03-5383-7051', '03-5383-7052', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0047', 'なんばーわん・グループホーム与野', 'ナンバーワン・グループホームヨノ', 'なんばーわん・グループホーム与野ナンバーワン・グループホームヨノ', '0047', '338-0006', '埼玉県さいたま市中央区八王子1丁目3番18号', null, '048-851-0905', '048-851-0902', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0048', 'イリ－ゼ和光', 'イリ－ゼワコウ', 'イリ－ゼ和光イリ－ゼワコウ', '0048', '351-0101', '埼玉県和光市白子1丁目29-15', null, '048-452-7701', '048-452-7702', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001','2023-10-01 00:00:00'),
  ('0000000000000000000F0049', 'イリ－ゼ三鷹深大寺', 'イリ－ゼミタカジンダイジ', 'イリ－ゼ三鷹深大寺イリ－ゼミタカジンダイジ', '0049', '181-0015', '東京都三鷹市大沢町4-15-6　', null, '0422-39-7351', '0422-39-7352', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001','2023-10-01 00:00:00'),
  ('0000000000000000000F0050', 'イリーゼ用賀ガーデン', 'イリーゼヨウガガーデン', 'イリーゼ用賀ガーデンイリーゼヨウガガーデン', '0050', '158-0097', '東京都世田谷区用賀1-19-22', null, '03-5491-6031', '03-5491-6032', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001','2023-10-01 00:00:00'),
  ('0000000000000000000F0051', 'ソナ―レ浦和', 'ソナ－レウラワ', 'ソナ―レ浦和ソナ－レウラワ', '0051', '330-0055', '埼玉県さいたま市浦和区東高砂町26-17', null, '048-711-1204', '048-711-1224', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0052', 'ヒューマンライフケア大泉学園', 'ヒューマンライフケアオオイズミガクエン', 'ヒューマンライフケア大泉学園ヒューマンライフケアオオイズミガクエン', '0052', '178-0061', '東京都練馬区大泉学園町3-5-28', null, '03-3923-7100', '03-3923-7280', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0053', 'ネクサスコート本郷', 'ネクサスコートホンゴウ', 'ネクサスコート本郷ネクサスコートホンゴウ', '0053', '113-0033', '東京都文京区本郷3丁目4番1号', null, '03-5842-5708', '03-5842-5721', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0054', 'ネクサスコート練馬', 'ネクサスコートネリマ', 'ネクサスコート練馬ネクサスコートネリマ', '0054', '179-0075', '東京都練馬区高松3丁目1番18号', null, '03-3998-3156', '03-3998-3157', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0055', 'サニーライフ東京新宿', 'サニーライフトウキョウシンジュク', 'サニーライフ東京新宿サニーライフトウキョウシンジュク', '0055', '169-0074', '東京都新宿区北新宿3-19-8', null, '03-3361-3600', '03-3361-3601', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001','2023-10-01 00:00:00'),
  ('0000000000000000000F0056', 'アライブ代々木大山町', 'アライブヨヨギオオヤマチョウ', 'アライブ代々木大山町アライブヨヨギオオヤマチョウ', '0056', '151-0065', '東京都渋谷区大山町27-15', null, '03-3468-4800', '03-3468-4810', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0057', 'サニーライフ新座', 'サニーライフニイザ', 'サニーライフ新座サニーライフニイザ', '0057', '352-0002', '埼玉県新座市東1-7-8', null, '048-489-1800', '048-489-1801', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001','2023-10-01 00:00:00'),
  ('0000000000000000000F0058', 'ネクサスコート久地', 'ネクサスコートクジ', 'ネクサスコート久地ネクサスコートクジ', '0058', '213-0033', '神奈川県川崎市高津区下作延6-31-17', null, '044-742-8500', '044-811-1150', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0059', 'ﾈｸｻｽｺｰﾄ多摩川桜並木', 'ネクサスコートタマガワサクラナミキ', 'ﾈｸｻｽｺｰﾄ多摩川桜並木ネクサスコートタマガワサクラナミキ', '0059', '214-0021', '神奈川県川崎市多摩区宿河原6-15-12', null, '044-272-5400', '044-933-5410', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0060', 'サニーライフさいたま桜', 'サニーライフサイタマサクラ', 'サニーライフさいたま桜サニーライフサイタマサクラ', '0060', '338-0823', '埼玉県さいたま市桜区栄和1-23-12', null, '048-856-3600', '048-856-3601', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001','2023-10-01 00:00:00'),
  ('0000000000000000000F0061', 'ネクサスコート青葉台', 'ネクサスコートアオバダイ', 'ネクサスコート青葉台ネクサスコートアオバダイ', '0061', '227-0047', '神奈川県横浜市青葉区みたけ台22-16', null, '045-508-9190', '045-972-6901', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0062', '愛・グループホーム瀬ケ崎', 'アイ・グループホームセガサキ', '愛・グループホーム瀬ケ崎アイ・グループホームセガサキ', '0062', '330-0044', '埼玉県さいたま市浦和区瀬ヶ崎4-13-19', null, '048-711-3973', '048-711-3974', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0063', 'サニーライフ板橋', 'サニーライフイタバシ', 'サニーライフ板橋サニーライフイタバシ', '0063', '175-0045', '東京都板橋区西台3-31-12', null, '03-5398-1800', '03-5398-1801', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001','2023-10-01 00:00:00'),
  ('0000000000000000000F0064', 'アライブ世田谷下馬', 'アライブセタガヤシモウマ', 'アライブ世田谷下馬アライブセタガヤシモウマ', '0064', '154-0002', '東京都世田谷区下馬6-29-22', null, '03-5433-5210', '03-3487-8533', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0065', 'アライブ杉並松庵', 'アライブスギナミショウアン', 'アライブ杉並松庵アライブスギナミショウアン', '0065', '167-0054', '東京都杉並区松庵2-15-12', null, '03-3333-2400', '03-3333-2833', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0066', 'ニチイケアセンター川口中青木', 'ニチイケアセンターカワグチナカアオキ', 'ニチイケアセンター川口中青木ニチイケアセンターカワグチナカアオキ', '0066', '332-0032', '埼玉県川口市中青木2-9-32', null, '048-250-6651', '048-253-0744', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0067', 'クラシックガーデン文京根津', 'クラシックガーデンブンキョウネズ', 'クラシックガーデン文京根津クラシックガーデンブンキョウネズ', '0067', '113-0031', '東京都文京区根津2-14-18', null, '03-5815-4665', '03-5815-4661', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0068', 'イリーゼ東久留米', 'イリーゼトダヒガシクルメ', 'イリーゼ東久留米イリーゼトダヒガシクルメ', '0068', '203-0054', '東京都東久留米市中央町3-12-14', null, '042-479-2831', '042-479-2832', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001','2023-10-01 00:00:00'),
  ('0000000000000000000F0069', 'アズハイム光が丘', 'アズハイムヒカリガオカ', 'アズハイム光が丘アズハイムヒカリガオカ', '0069', '177-0032', '東京都練馬区谷原4-3-23', null, '03-3904-6490', '03-3904-6494', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0070', '社会福祉法人和楽館', 'シャカイフクシホウジンワラクカン', '社会福祉法人和楽館シャカイフクシホウジンワラクカン', '0070', '213-0022', '神奈川県川崎市高津区千年141-2', null, '044-766-7660', '044-766-4980', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0071', '社会福祉法人わらく桃の丘', 'シャカイフクシホウジンワラクモモノオカ', '社会福祉法人わらく桃の丘シャカイフクシホウジンワラクモモノオカ', '0071', '216-0001', '神奈川県川崎市宮前区野川515', null, '044-777-8910', '044-777-8911', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0072', 'うらら新浦安', 'ウララシンウラヤス', 'うらら新浦安ウララシンウラヤス', '0072', '279-0014', '千葉県浦安市明海2-12-1', null, '047-380-6800', '047-380-6807', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0073', 'ニチイケアセンター荻窪', 'ニチイケアセンターオギクボ', 'ニチイケアセンター荻窪ニチイケアセンターオギクボ', '0073', '167-0051', '東京都杉並区荻窪1-15-13', null, '03-5349-7982', '03-3392-8807', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0074', 'ニチイケアセンター西府', 'ニチイケアセンターニシフ', 'ニチイケアセンター西府ニチイケアセンターニシフ', '0074', '183-0032', '東京都府中市本宿町1-24-6', null, '042-352-8266', '042-352-8267', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0075', 'イリーゼ新座', 'イリーゼニイザ', 'イリーゼ新座イリーゼニイザ', '0075', '352-0035', '埼玉県新座市栗原1-14-23', null, '042-479-2760', '042-479-2761', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001','2023-10-01 00:00:00'),
  ('0000000000000000000F0076', 'ﾆﾁｲｹｱｾﾝﾀｰいずみこまえ', 'ニチイケアセンターイズミコマエ', 'ﾆﾁｲｹｱｾﾝﾀｰいずみこまえニチイケアセンターイズミコマエ', '0076', '201-0012', '東京都狛江市中和泉1-20-3', null, '03-5438-5760', '03-5438-5761', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0077', 'アズハイム大泉学園', 'アズハイムオオイズミガクエン', 'アズハイム大泉学園アズハイムオオイズミガクエン', '0077', '178-0062', '東京都練馬区大泉町6-7-15', null, '03-3978-0591', '03-3978-0592', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0078', 'グループホームももちゃん', 'グループホームモモチャン', 'グループホームももちゃんグループホームモモチャン', '0078', '157-0071', '東京都世田谷区千歳台5-22-1　3F', null, '03-5490-7063', '03-5490-7064', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0079', 'ﾆﾁｲｹｱｾﾝﾀｰ世田谷大蔵', 'ニチイケアセンターセタガヤオオクラ', 'ﾆﾁｲｹｱｾﾝﾀｰ世田谷大蔵ニチイケアセンターセタガヤオオクラ', '0079', '157-0074', '東京都世田谷区大蔵4-2-14', null, '03-5727-0762', '03-3415-6130', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0080', 'アライブ目白', 'アライブメジロ', 'アライブ目白アライブメジロ', '0080', '161-0033', '東京都新宿区下落合2-19-27', null, '03-5988-7210', '03-3950-2282', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0081', 'サニ－ライフ東川口', 'サニ－ライフヒガシカワグチ', 'サニ－ライフ東川口サニ－ライフヒガシカワグチ', '0081', '333-0803', '埼玉県川口市藤兵衛新田字中通168-1', null, '048-299-1800', '048-299-1883', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001','2023-10-01 00:00:00'),
  ('0000000000000000000F0082', 'ｸﾞﾙｰﾌﾟﾎｰﾑきらら西荻窪', 'グループホームキララニシオギクボ', 'ｸﾞﾙｰﾌﾟﾎｰﾑきらら西荻窪グループホームキララニシオギクボ', '0082', '167-0035', '東京都杉並区今川3-3-29', null, '03-5311-5586', '03-5311-5587', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0083', 'ホスピタルメント武蔵野', 'ホスピタルメントムサシノ', 'ホスピタルメント武蔵野ホスピタルメントムサシノ', '0083', '183-0013', '東京都武蔵野市西久保1-24-13', null, '0422-27-8824', '0422-27-8821', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0084', 'イリ－ゼ小平', 'イリ－ゼコダイラ', 'イリ－ゼ小平イリ－ゼコダイラ', '0084', '187-0041', '東京都小平市美園町3-20-1', null, '0423-49-8531', '0423-49-8532', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001','2023-10-01 00:00:00'),
  ('0000000000000000000F0085', 'アライブ世田谷中町', 'アライブセタガヤナカマチ', 'アライブ世田谷中町アライブセタガヤナカマチ', '0085', '158-0091', '東京都世田谷区中町3-5-23', null, '03-3701-6530', '03-3701-6531', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0086', 'ｺｺﾌｧﾝ柿生', 'ココファンカキオ', 'ｺｺﾌｧﾝ柿生ココファンカキオ', '0086', '215-0021', '神奈川県麻生区上麻生7-2-32', null, '044-989-3701', '044-989-3702', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0087', 'ニチイホ－ﾑ成城', 'ニチイホ－ムセイジョウ', 'ニチイホ－ﾑ成城ニチイホ－ムセイジョウ', '0087', '157-0065', '東京都世田谷区上祖師谷4-24-15', null, '03-5384-7511', '03-5384-7512', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0088', 'ソナーレ石神井', 'ソナーレシャクジイ', 'ソナーレ石神井ソナーレシャクジイ', '0088', '177-0053', '東京都練馬区関町南1-2-32', null, '03-6904-9600', '03-6904-9601', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0089', '愛の家グループホーム西尾久', 'アイノイエグループホームニシオク', '愛の家グループホーム西尾久アイノイエグループホームニシオク', '0089', '116-0011', '東京都荒川区西尾久5-27-9', null, '03-5692-5270', '03-5692-5271', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0090', 'イリーゼ都賀桜木', 'イリーゼツガサクラギ', 'イリーゼ都賀桜木イリーゼツガサクラギ', '0090', '264-0028', '千葉県千葉市若葉区桜木5-17-30', null, '043-214-3531', '043-214-3532', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001','2023-10-01 00:00:00'),
  ('0000000000000000000F0091', 'イリーゼ練馬中村橋', 'イリーゼネリマナカムラバシ', 'イリーゼ練馬中村橋イリーゼネリマナカムラバシ', '0091', '176-0025', '東京都練馬区中村南2-1-11', null, '03-5987-3071', '03-5987-3072', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001','2023-10-01 00:00:00'),
  ('0000000000000000000F0092', 'アライブ久が原', 'アライブクガハラ', 'アライブ久が原アライブクガハラ', '0092', '146-0085', '東京都大田区久が原4-8-18', null, '03-5747-5580', '03-3752-4620', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0093', 'イリーゼ西国分寺', 'イリーゼニシコクブンジ', 'イリーゼ西国分寺イリーゼニシコクブンジ', '0093', '185-0024', '東京都国分寺市泉町3-37-20', null, '0423-29-5171', '0423-29-5172', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001','2023-10-01 00:00:00'),
  ('0000000000000000000F0094', 'ニチイケアセンター下連雀', 'ニチイケアセンターシモレンジャク', 'ニチイケアセンター下連雀ニチイケアセンターシモレンジャク', '0094', '181-0013', '東京都三鷹市下連雀4-21-20', null, '0422-76-6731', '0422-76-6732', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0095', 'ニチイケアセンター川崎長沢', 'ニチイケアセンターカワサキナガサワ', 'ニチイケアセンター川崎長沢ニチイケアセンターカワサキナガサワ', '0095', '214-0035', '神奈川県川崎市多摩区長沢1-32-7', null, '044-978-3361', '044-978-3362', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0096', '医心館　成増', 'イシンカンナリマス', '医心館成増イシンカンナリマス', '0096', '175-0094', '東京都板橋区成増3-19-19', null, '03-6904-0205', '03-6904-0206', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0097', 'ネクサスコート麻生栗木台', 'ネクサスコートアサオクリキダイ', 'ネクサスコート麻生栗木台ネクサスコートアサオクリキダイ', '0097', '215-0032', '神奈川県川崎市麻生区栗木台2-14-7', null, '044-299-6631', '044-981-6651', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0098', 'ニチイホーム杉並堀ノ内', 'ニチイホームスギナミホリノウチ', 'ニチイホーム杉並堀ノ内ニチイホームスギナミホリノウチ', '0098', '166-0013', '東京都杉並区堀ノ内2-29-16', null, '03-5305-7070', '03-5305-7043', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0099', 'きらら新高円寺', 'キララシンコウエンジ', 'きらら新高円寺キララシンコウエンジ', '0099', '166-0013', '東京都杉並区堀ノ内3-5-18', null, '03-5378-7807', '03-5305-7043', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0100', 'ニチイケアセンター戸田中町', 'ニチイケアセンタートダナカチョウ', 'ニチイケアセンター戸田中町ニチイケアセンタートダナカチョウ', '0100', '335-0012', '埼玉県戸田市中町2-6-17', null, '048-420-3505', '048-420-3506', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0101', 'サニーライフ草加', 'サニーライフソウカ', 'サニーライフ草加サニーライフソウカ', '0101', '340-0036', '埼玉県草加市苗塚町470', null, '048-925-0018', '048-925-0019', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001','2023-10-01 00:00:00'),
  ('0000000000000000000F0102', 'ナーシングホーム日和高木', 'ナーシングホームヒヨリタカギ', 'ナーシングホーム日和高木ナーシングホームヒヨリタカギ', '0102', '331-0071', '埼玉県さいたま市西区高木266番', null, '048-782-7440', '048-729-4710', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0103', 'ニチイホームさいたま新都心', 'ニチイホームサイタマシントシン', 'ニチイホームさいたま新都心ニチイホームサイタマシントシン', '0103', '330-0843', '埼玉県さいたま市大宮区吉敷町4-255-1', null, '048-650-0821', '048-650-0823', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0104', 'サニーライフ新座南', 'サニーライフニイザミナミ', 'サニーライフ新座南サニーライフニイザミナミ', '0104', '352-0031', '埼玉県新座市西堀2-15-60', null, '042-491-0036', '042-491-0038', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001','2023-10-01 00:00:00'),
  ('0000000000000000000F0105', '愛GH豊島池袋', 'アイグループホームトシマイケブクロ', '愛GH豊島池袋アイグループホームトシマイケブクロ', '0105', '170-0014', '東京都豊島区池袋1-16-10', null, '03-6914-0763', '03-6914-0764', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0106', 'トラストガーデン荻窪', 'トラストガーデンオギクボ', 'トラストガーデン荻窪トラストガーデンオギクボ', '0106', '167-0033', '東京都杉並区清水2-4-3', null, '03-5311-1091', '03-5311-1092', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0107', 'メディクスケアホーム松戸', 'メディクスケアホームマツド', 'メディクスケアホーム松戸メディクスケアホームマツド', '0107', '271-0092', '千葉県松戸市松戸1063-1', null, '047-366-0072', '047-366-0071', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0108', 'ケヤキ倶楽部東浦和', 'ケヤキクラブヒガシウラワ', 'ケヤキ倶楽部東浦和ケヤキクラブヒガシウラワ', '0108', '336-0923', '埼玉県さいたま市緑区大間木2-3-3', null, '048-874-1850', '048-874-1852', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0109', 'アライブ世田谷代田', 'アライブセタガヤダイタ', 'アライブ世田谷代田アライブセタガヤダイタ', '0109', '155-0033', '東京都世田谷区代田2-26-8', null, '03-5433-6100', '03-5433-6101', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0110', 'ニチイホーム渋谷本町', 'ニチイホームシブヤホンマチ', 'ニチイホーム渋谷本町ニチイホームシブヤホンマチ', '0110', '151-0071', '東京都渋谷区本町4-49-15', null, '03-6300-0290', '03-3320-2120', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0111', 'トラストガーデン杉並宮前', 'トラストガーデンオギクボスギナミミヤマエ', 'トラストガーデン杉並宮前トラストガーデンオギクボスギナミミヤマエ', '0111', '168-0081', '東京都杉並区宮前2-11-10', null, '03-5336-6677', '03-5336-6033', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0112', 'ソナーレ浜田山', 'ソナーレハマダヤマ', 'ソナーレ浜田山ソナーレハマダヤマ', '0112', '168-0065', '東京都杉並区浜田山3-26-8', null, '03-6454-6161', '03-6454-6070', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0113', 'ココファン鶴川駅前', 'ココファンツルカワエキマエ', 'ココファン鶴川駅前ココファンツルカワエキマエ', '0113', '195-0053', '東京都町田市能ケ谷1-8-3', null, '042-737-2253', '042-708-3521', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0114', 'ココファン浦和六辻', 'ココファンウラワムツジ', 'ココファン浦和六辻ココファンウラワムツジ', '0114', '336-0026', '埼玉県さいたま市南区辻3-3-15', null, '048-711-2550', '048-829-7555', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0115', 'ピュアリーフ浦和', 'ピュアリーフウラワ', 'ピュアリーフ浦和ピュアリーフウラワ', '0115', '336-0932', '埼玉県さいたま市緑区中尾661-1', null, '048-875-8118', '048-875-8117', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0116', 'フェリオ成城', 'フェリオセイジョウ', 'フェリオ成城フェリオセイジョウ', '0116', '157-0072', '東京都世田谷区祖師谷4-32-7', null, '03-5429-2451', null, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0117', 'アライブ浜田山', 'アライブハマダヤマ', 'アライブ浜田山アライブハマダヤマ', '0117', '168-0072', '東京都杉並区高井戸東4-27-1', null, '03-5336-7600', '03-5336-8380', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0118', 'トラストガーデン本郷', 'トラストガーデンホンゴウ', 'トラストガーデン本郷トラストガーデンホンゴウ', '0118', '113-0023', '東京都文京区向丘2-2-6', null, '03-5805-7420', '03-3818-5730', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0119', '看多機ぴゅあたいむ', 'カンタキピュアタイム', '看多機ぴゅあたいむカンタキピュアタイム', '0119', '333-0823', '埼玉県川口市大字石神1708', 'ピュアリーフ川口内', '048-299-6972', '048-296-7774', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0120', 'ローベル西台', 'ローベルニシダイ', 'ローベル西台ローベルニシダイ', '0120', '174-0045', '東京都板橋区西台1-40-15', null, '03-6279-8101', '03-6279-8112', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0121', 'アズハイム横浜戸塚', 'アズハイムヨコハマトツカ', 'アズハイム横浜戸塚アズハイムヨコハマトツカ', '0121', '245-0062', '神奈川県横浜市戸塚区汲沢1047', null, '045-390-0490', '045-390-0491', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0122', 'ネクサスコート橋本', 'ネクサスコートハシモト', 'ネクサスコート橋本ネクサスコートハシモト', '0122', '252-0131', '神奈川県相模原市緑区西橋本一丁目4番8号', null, '042-703-4321', '042-773-5504', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0123', 'ソナーレ目白御留山', 'ソナーレメジロオトメヤマ', 'ソナーレ目白御留山ソナーレメジロオトメヤマ', '0123', '161-0033', '東京都新宿区下落合4-9-15', null, '03-3565-6321', '03-3565-6040', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0124', '花珠の家なかはら', 'ハナダマノイエナカハラ', '花珠の家なかはらハナダマノイエナカハラ', '0124', '211-0041', '神奈川県川崎市中原区下小田中5-14-14', null, '044-740-3388', '044-752-5289', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0125', 'なごやかレジデンス溝の口', 'ナゴヤカレジデンスミゾノクチ', 'なごやかレジデンス溝の口ナゴヤカレジデンスミゾノクチ', '0125', '213-0032', '神奈川県川崎市高津区久地2-23-16', null, '044-850-1681', null, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0126', 'ピュアライフ川口芝公園', 'ピュアライフカワグチシバコウエン', 'ピュアライフ川口芝公園ピュアライフカワグチシバコウエン', '0126', '333-0848', '埼玉県川口市芝下1-5-11', null, '048-267-2111', null, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0127', '花物語かながわ', 'ハナモノガタリカナガワ', '花物語かながわハナモノガタリカナガワ', '0127', '221-0863', '神奈川県横浜市神奈川区羽沢町」1196-18', null, '045-370-6886', '045-370-6887', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0128', 'スマイルハウス', 'スマイルハウス', 'スマイルハウススマイルハウス', '0128', '336-0974', '埼玉県さいたま市緑区大字大崎2160番地', null, '048-878-2922', '048-878-2993', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001','2023-10-01 00:00:00'),
  ('0000000000000000000F0129', 'たいようの杜', 'タイヨウノモリ', 'たいようの杜タイヨウノモリ', '0129', '330-0061', '埼玉県さいたま市浦和区常盤8-17-9', null, '048-825-0007', '048-825-0008', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0130', '康寿園グループホーム輝', 'コウジュエングループホームカガヤキ', '康寿園グループホーム輝コウジュエングループホームカガヤキ', '0130', '359-1106', '埼玉県所沢市東狭山ヶ丘6-2796-1', null, '04-2929-8811', '04-2929-8813', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0131', 'GH花物語みたか', 'グループホームハナモノガタリミタカ', 'GH花物語みたかグループホームハナモノガタリミタカ', '0131', '181-0012', '東京都三鷹市上連雀8-13-24', null, '0422-79-5287', '04-2929-8813', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0132', 'むさしの園　わかば', 'ムサシノエン　ワカバ', 'むさしの園わかばムサシノエンワカバ', '0132', '350-1316', '埼玉県狭山市南入曽1048-2', null, '04-2956-7760', '04-2937-7099', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0133', 'むさしの園', 'ムサシノエン', 'むさしの園ムサシノエン', '0133', '350-1316', '埼玉県狭山市南入曽1044-1', null, '04-2956-7770', '04-2956-7771', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0134', 'すみれ野', 'スミレノ', 'すみれ野スミレノ', '0134', '359-1106', '埼玉県所沢市東狭山ヶ丘4-2658-1', null, '04-2935-3511', '04-2935-3515', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0135', 'ニチイケアセンター東狭山ヶ丘', 'ニチイケアセンターヒガシサヤマガオカ', 'ニチイケアセンター東狭山ヶ丘ニチイケアセンターヒガシサヤマガオカ', '0135', '359-1106', '埼玉県所沢市東狭山ヶ丘3-682-6', null, '04-2968-3554', '04-2968-3954', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0136', '亀令園', 'キレイエン', '亀令園キレイエン', '0136', '359-1106', '埼玉県所沢市東狭山ケ丘4-2695-1', null, '04-2926-8088 ', '04-2928-8875', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0137', '康寿園', 'コウジュエン', '康寿園コウジュエン', '0137', '359-1106', '埼玉県所沢市東狭山ケ丘6-2833-1', null, '04-2926-7711', '04-2926-7775', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0138', '平安の森', 'ヘイアンノモリ', '平安の森ヘイアンノモリ', '0138', '359-1106', '埼玉県所沢市東狭山ヶ丘4-2678-1', null, '04-2925-5230', '04-2925-5232', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0139', 'イリーゼ溝の口', 'イリーゼミゾノクチ', 'イリーゼ溝の口イリーゼミゾノクチ', '0139', '213-0001', '神奈川県川崎市高津区溝口6丁目15番4号', null, '044-850-1006', '044-850-1007', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0140', 'イリーゼ調布', 'イリーゼチョウフ', 'イリーゼ調布イリーゼチョウフ', '0140', '182-0025', '東京都調布市多摩川1-13-1', null, '042-443-0461', '042-443-0462', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0141', 'イリーゼ狛江', 'イリーゼコマエ', 'イリーゼ狛江イリーゼコマエ', '0141', '201-0003', '東京都狛江市和泉本町3-27-7', null, '03-5438-5781', '03-5438-5782', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0142', 'イリーゼたまプラーザ', 'イリーゼタマプラーザ', 'イリーゼたまプラーザイリーゼタマプラーザ', '0142', '225-0001', '神奈川県横浜市青葉区美しが丘西', '1丁目5-31', '045-901-7155', '045-901-7156', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0143', 'イリーゼ三鷹深大寺', 'イリーゼミタカジンダイジ', 'イリーゼ三鷹深大寺イリーゼミタカジンダイジ', '0143', '181-0015', '東京都三鷹市大沢4丁目15番6号', null, '0422-39-7351', '0422-39-7352', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0144', 'イリーゼ横浜仲町台', 'イリーゼヨコハマナカマチダイ', 'イリーゼ横浜仲町台イリーゼヨコハマナカマチダイ', '0144', '224-0034', '神奈川県横浜市都筑区勝田町1219-8', null, '045-948-5615', '045-948-5616', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0145', 'イリーゼ横浜センター南', 'イリーゼヨコハマセンターミナミ', 'イリーゼ横浜センター南イリーゼヨコハマセンターミナミ', '0145', '224-0003', '神奈川県横浜市都筑区中川中央2-3-28', null, '045-590-0230', '045-593-5005', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0146', 'イリーゼ蒲田・悠生苑', 'イリーゼカマタ・ユウセイエン', 'イリーゼ蒲田・悠生苑イリーゼカマタ・ユウセイエン', '0146', '144-0032', '東京都大田区北糀谷2丁目15-21', null, '03-3744-5781', '03-3744-5782', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0147', 'イリーゼあざみ野', 'イリーゼアザミノ', 'イリーゼあざみ野イリーゼアザミノ', '0147', '225-0011', '神奈川県横浜市青葉区あざみ野4-32-2', null, '045-905-2214', '045-903-9545', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0148', 'イリーゼ相模大野', 'イリーゼサガミオオノ', 'イリーゼ相模大野イリーゼサガミオオノ', '0148', '252-0318', '神奈川県相模原市南区上鶴間本町', '7丁目4番23号', '042-701-0671', '042-701-0672', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0149', 'イリーゼ二子玉川ガーデン', 'イリーゼフタコタマガワガーデン', 'イリーゼ二子玉川ガーデンイリーゼフタコタマガワガーデン', '0149', '157-0077', '東京都世田谷区鎌田4-14-8', null, '03-5727-0327', '03-3417-1834', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0150', 'イリーゼ町田図師の丘', 'イリーゼマチダズシノオカ', 'イリーゼ町田図師の丘イリーゼマチダズシノオカ', '0150', '194-0203', '東京都町田市図師町1896-1', null, '042-789-8050', '042-789-8052', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0151', 'イリーゼ多摩はるひ野', 'イリーゼタマハルヒノ', 'イリーゼ多摩はるひ野イリーゼタマハルヒノ', '0151', '215-0036', '神奈川県川崎市麻生区はるひ野5-21-1', null, '044-980-3321', '044-980-3322', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0152', 'イリーゼさぎぬま', 'イリーゼサギヌマ', 'イリーゼさぎぬまイリーゼサギヌマ', '0152', '216-0002', '神奈川県川崎市宮前区東有馬3丁目20番3号', null, '044-862-6351', '044-862-6352', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0153', 'イリーゼさぎぬま・新館', 'イリーゼサギヌマ・シンカン', 'イリーゼさぎぬま・新館イリーゼサギヌマ・シンカン', '0153', '216-0005', '神奈川県川崎市宮前区土橋4丁目8-2', null, '044-870-5771', '044-870-5772', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0154', 'イリーゼ狛江・別邸', 'イリーゼコマエ・ベッテイ', 'イリーゼ狛江・別邸イリーゼコマエ・ベッテイ', '0154', '201-0002', '東京都狛江市東野川1丁目32番5号', null, '03-5761-3471', '03-5761-3472', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0155', 'イリーゼ横浜三ッ沢', 'イリーゼヨコハマミツザワ', 'イリーゼ横浜三ッ沢イリーゼヨコハマミツザワ', '0155', '240-0062', '神奈川県横浜市保土ヶ谷区岡沢町287-2', null, '045-348-3151', '045-348-3152', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0156', 'コンシェ－ル徳丸', 'コンシェ－ルトクマル', 'コンシェ－ル徳丸コンシェ－ルトクマル', '0156', '175-0083', '東京都板橋区徳丸7丁目17番1号', null, '03-6478-1098', null, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0157', 'イリ－ゼ用賀', 'イリ－ゼヨウガ', 'イリ－ゼ用賀イリ－ゼヨウガ', '0157', '158-0097', '東京都世田谷区用賀1丁目19番22号', null, '0120-122-943', null, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0158', 'アズハイム杉並井草', 'アズハイムスギナミイグサ', 'アズハイム杉並井草アズハイムスギナミイグサ', '0158', '167-0021', '東京都杉並区井草4-17-14', null, '03-5311-1565', '03-5311-1566', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0159', 'ピュアリ－フ大宮', 'ピュアリ－フオオミヤ', 'ピュアリ－フ大宮ピュアリ－フオオミヤ', '0159', '330-0856', '埼玉県さいたま市大宮区三橋2-673-1', null, '048-644-3915', '048-644-3916', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0160', '在宅ホスピス橋本', 'ザイタクホスピスハシモト', '在宅ホスピス橋本ザイタクホスピスハシモト', '0160', '252-0131', '神奈川県相模原市緑区西橋本一丁目4番8号　', 'ネクサスコート橋本内', '042-703-5365', '042-703-5366', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0161', 'アズハイム川越', 'アズハイムカワゴエ', 'アズハイム川越アズハイムカワゴエ', '0161', '350-1151', '埼玉県川越市今福843-1', null, '049-249-8840', '049-243-2240', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0162', 'アズハイム上福岡', 'アズハイムカミフクオカ', 'アズハイム上福岡アズハイムカミフクオカ', '0162', '350-1145', '埼玉県川越市清水町4-7', null, '049-291-5577', '049-241-3711', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0163', 'ピュアリーフ川口', 'ピュアリーフカワグチ', 'ピュアリーフ川口ピュアリーフカワグチ', '0163', '333-0823', '埼玉県川口市大字石神1708', null, '048-296-7773', '048-296-7774', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0164', 'ミモザ川崎たちばな弐番館', 'ミモザカワサキタチバナニバンカン', 'ミモザ川崎たちばな弐番館ミモザカワサキタチバナニバンカン', '0164', '213-0023', '神奈川県川崎市高津区子母口258-2', null, '044-741-1175', '044-741-1176', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0165', 'ニチイホーム練馬高野台', 'ニチイホームネリマタカノダイ', 'ニチイホーム練馬高野台ニチイホームネリマタカノダイ', '0165', '177-0035', '東京都練馬区南田中3-17-11', null, '03-5923-0071', null, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0166', '愛グループホーム川崎野川', 'アイグループホームカワサキノガワ', '愛グループホーム川崎野川アイグループホームカワサキノガワ', '0166', '216-0001', '神奈川県川崎市宮前区野川986', null, '044-750-1017', '044-750-1018', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0167', '所沢けやき', 'トコロザワケヤキ', '所沢けやきトコロザワケヤキ', '0167', '359-1164', '埼玉県所沢市三ケ島5-551', null, '04-2947-2741', '04-2949-5383', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0168', '小手指サポートハウス', 'コテサシサポートハウス', '小手指サポートハウスコテサシサポートハウス', '0168', '359-1147', '埼玉県所沢市小手指元町1-9-2', null, '04-2947-3914', '04-2947-3981', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0169', '福祉の森', 'フクシノモリ', '福祉の森フクシノモリ', '0169', '359-1145', '埼玉県所沢市所沢市山口1850-8', null, '04-2921-3600', '04-2926-0066', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0170', '大光園', 'タイコウエン', '大光園タイコウエン', '0170', '359-1106', '埼玉県所沢市東狭山ヶ丘6丁目750－1', null, '04-2929-2233', '04-2921-8801', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0171', 'レジデンシャル小手指Ｓａｋｕｒａ', 'レジデンシャルコテサシサクラ', 'レジデンシャル小手指Ｓａｋｕｒａレジデンシャルコテサシサクラ', '0171', '359-1141', '埼玉県所沢市小手指町4-18-1', null, '04-2941-5522', '04-2941-5523', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0172', 'ブリエライフ狭山', 'ブリエライフサヤマ', 'ブリエライフ狭山ブリエライフサヤマ', '0172', '350-1307', '埼玉県狭山市祗園11-1', null, '04-2957-2111', '04-2957-2112', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0173', 'ブリエライフ狭山２', 'ブリエライフサヤマツー', 'ブリエライフ狭山２ブリエライフサヤマツー', '0173', '350-1307', '埼玉県狭山市祇園40番22号', null, '04-2950-7010', '04-2950-7011', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0174', 'アリスの家　ローズ館', 'アリスノイエローズカン', 'アリスの家ローズ館アリスノイエローズカン', '0174', '359-1142', '埼玉県所沢市上新井5-15-13', null, '04-2929-0074', '04-2968-4423', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0175', 'アリスの家　清瀬館', 'アリスノイエキヨセカン', 'アリスの家清瀬館アリスノイエキヨセカン', '0175', '204-0012', '東京都清瀬市中清戸3-306-1', null, '042-497-8625', '042-497-8627', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0176', 'アリスの家　椿峰館', 'アリスノイエツバキミネカン', 'アリスの家椿峰館アリスノイエツバキミネカン', '0176', '359-1146', '埼玉県所沢市小手指南6-3-9', null, '04-2949-6647', '04-2949-6648', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0177', 'あおぞら南永井', 'アオゾラミナミナガイ', 'あおぞら南永井アオゾラミナミナガイ', '0177', '359-0011', '埼玉県所沢市南永井2-7', null, '04-2991-2727', '04-2991-2728', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0178', 'あおぞら宮寺', 'アオゾラミヤデラ', 'あおぞら宮寺アオゾラミヤデラ', '0178', '358-0014', '埼玉県入間市宮寺1721-1', null, '04-2941-3466', '04-2941-3470', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0179', 'あおぞら山口', 'アオゾラヤマグチ', 'あおぞら山口アオゾラヤマグチ', '0179', '359-0045', '埼玉県所沢市山口2584 ', null, '04-2903-6131', '04-2903-6130', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0180', 'マザーズハウス東村山', 'マザーズハウスヒガシムラヤマ', 'マザーズハウス東村山マザーズハウスヒガシムラヤマ', '0180', '189-0022', '東京都東村山市野口町4丁目10-12', null, '042-519-3871', '042-399-3304', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0181', 'ヒューマンライフ立川', 'ヒューマンライフタチカワ', 'ヒューマンライフ立川ヒューマンライフタチカワ', '0181', '190-0022', '東京都立川市錦町3丁目8-10', null, '042-526-5022', '04-2526-6552', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0182', '福寿むさしむらやま本町', 'フクジュムサシムラヤマホンマチ', '福寿むさしむらやま本町フクジュムサシムラヤマホンマチ', '0182', '208-0004', '東京都武蔵村山市本町5丁目2-1', null, '042-569-6787', '04-2569-6790', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0183', '花物語たちかわ', 'ハナモノガタリタチカワ', '花物語たちかわハナモノガタリタチカワ', '0183', '190-0002', '東京都立川市幸町3丁目7-10', null, '042-538-2487', '042-538-2497', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0184', 'ニチイケアセンター所沢上安松', 'ニチイケアセンタートコロザワカミヤスマツ', 'ニチイケアセンター所沢上安松ニチイケアセンタートコロザワカミヤスマツ', '0184', '359-0025', '埼玉県所沢市大字上安松907-1', null, '04-2997-0606', '04-2997-0607', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0185', 'ニチイケアセンター東村山', 'ニチイケアセンターヒガシムラヤマ', 'ニチイケアセンター東村山ニチイケアセンターヒガシムラヤマ', '0185', '189-0022', '東京都東村山市野口町1丁目12-31', null, '042-398-5281', '042-398-5283', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0186', 'イリーゼ狭山', 'イリーゼサヤマ', 'イリーゼ狭山イリーゼサヤマ', '0186', '350-1327', '埼玉県狭山市笹井3-10-5', null, '04-2900-1151', '042-900-1152', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0187', 'イリーゼ鶴ヶ島', 'イリーゼツルガシマ', 'イリーゼ鶴ヶ島イリーゼツルガシマ', '0187', '350-2205', '埼玉県鶴ヶ島市松ヶ丘3丁目23番3', null, '049-279-6021', '049-279-6022', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0188', 'イリーゼ狭山富士見', 'イリーゼサヤマフジミ', 'イリーゼ狭山富士見イリーゼサヤマフジミ', '0188', '350-1305', '埼玉県狭山市入間川3155-1', null, '04-2999-6654', '04-2999-6655', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0189', 'ミモザ宮前', 'ミモザミヤマエ', 'ミモザ宮前ミモザミヤマエ', '0189', '216-0044', '神奈川県川崎市宮前区西野川３－４－１', null, '044-750-7785', '044-750-7791', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0190', 'サニーライフ入間', 'サニーライフイルマ', 'サニーライフ入間サニーライフイルマ', '0190', '358-0021', '埼玉県入間市高倉1-9-45', null, '04-2963-3600', '04-2963-3603', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0191', 'サニーライフ新座', 'サニーライフニイザ', 'サニーライフ新座サニーライフニイザ', '0191', '352-0002', '埼玉県新座市東1-7-8', null, '048-489-1800', '048-489-1801', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0192', 'サニーライフ新座南', 'サニーライフニイザミナミ', 'サニーライフ新座南サニーライフニイザミナミ', '0192', '352-0031', '埼玉県新座市西堀2-15-60', null, '042-491-0036', '042-491-0038', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0193', 'ヒューマンライフケア中村橋グループホーム', 'ヒューマンライフケアナカムラバシグループホーム', 'ヒューマンライフケア中村橋グループホームヒューマンライフケアナカムラバシグループホーム', '0193', '176-0021', '東京都練馬区貫井5丁目１０-14', null, '03-5971-2025', '03-5241-8026', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0194', 'ニチイホーム板橋徳丸', 'ニチイホームイタバシトクマル', 'ニチイホーム板橋徳丸ニチイホームイタバシトクマル', '0194', '175-0083', '東京都板橋区徳丸4-19-10', null, '03-5945-2361', '03-5945-2362', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0195', 'ミモザ善福寺一番館', 'ミモザゼンプクジイチバンカン', 'ミモザ善福寺一番館ミモザゼンプクジイチバンカン', '0195', '167-0041', '東京都杉並区善福寺3-9-14', null, '03-5310-7511', '03-5310-7512', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0196', 'ミモザ善福寺弐番館', 'ミモザゼンプクジニバンカン', 'ミモザ善福寺弐番館ミモザゼンプクジニバンカン', '0196', '167-0041', '東京都杉並区善福寺3-9-17', null, '03-5311-1205', null, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0197', '愛の家グループホーム杉並高井戸', 'アイノイエグループホームスギナミタカイド', '愛の家グループホーム杉並高井戸アイノイエグループホームスギナミタカイド', '0197', '168-0074', '東京都杉並区上高井戸2-8-27', null, '03-5336-3230', null, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0198', 'ウェルケアガーデン深沢', 'ウェルケアガーデンフカサワ', 'ウェルケアガーデン深沢ウェルケアガーデンフカサワ', '0198', '158-0081', '東京都世田谷区深沢1-32-18', null, '03-5707-7631', '03-5707-1560', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0199', 'クラーチ・ファミリア光が丘公園', 'クラーチファミリアヒカリガオカコウエン', 'クラーチ・ファミリア光が丘公園クラーチファミリアヒカリガオカコウエン', '0199', '179-0073', '東京都練馬区田柄2-39-1', null, '03-6915-6611', '03-6915-6634', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0200', 'アズハイム文京白山', 'アズハイムブンキョウハクサン', 'アズハイム文京白山アズハイムブンキョウハクサン', '0200', '112-0001', '東京都文京区白山4-36-13', null, '03-3943-6105', '03-3943-6108', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0201', 'アズハイム一之江', 'アズハイムイチノエ', 'アズハイム一之江アズハイムイチノエ', '0201', '132-0023', '東京都江戸川区西一之江3-8-8', null, '03-5879-3345', '03-5879-3346', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0202', 'ソナーレ杉並井草', 'ソナーレスギナミイグサ', 'ソナーレ杉並井草ソナーレスギナミイグサ', '0202', '167-0023', '東京都杉並区上井草1-24-7', null, '03-6454-7215', null, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0203', 'ローベル西荻窪', 'ローベルニシオギクボ', 'ローベル西荻窪ローベルニシオギクボ', '0203', '167-0042', '東京都杉並区西荻北3-11-25', null, '03-6913-6222', null, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0204', 'ニチイホーム野方', 'ニチイホームノカタ', 'ニチイホーム野方ニチイホームノカタ', '0204', '165-0027', '東京都中野区野方5-11-10', null, '03-5356-2351', null, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0205', 'アズハイム綱島', 'アズハイムツナシマ', 'アズハイム綱島アズハイムツナシマ', '0205', '230-0071', '神奈川県横浜市鶴見区駒岡4-29-1', null, '045-710-0680', '045-710-0685', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0206', 'ホスピタルメント文京千駄木', 'ホスピタルメントブンキョウセンダギ', 'ホスピタルメント文京千駄木ホスピタルメントブンキョウセンダギ', '0206', '113-0022', '東京都文京区千駄木3-14-10', null, '03-5834-2613', '03-5834-2631', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0207', '花物語とよす', 'ハナモノガタリトヨス', '花物語とよすハナモノガタリトヨス', '0207', '135-0051', '東京都江東区枝川2丁目14番2号', null, '03-3644-0854', '03-5665-1121', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0208', 'イリーゼ入間', 'イリーゼイルマ', 'イリーゼ入間イリーゼイルマ', '0208', '358-0006', '埼玉県入間市春日町1-10-26', null, '04-2960-6851', '04-2960-6852', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0209', 'イリ－ゼ浦和大門', 'イリ－ゼウラワダイモン', 'イリ－ゼ浦和大門イリ－ゼウラワダイモン', '0209', '336-0963', '埼玉県さいたま市緑区大門808', null, '048-812-1206', '048-812-1208', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0210', 'アズハイム千葉幕張', 'アズハイムチバマクハリ', 'アズハイム千葉幕張アズハイムチバマクハリ', '0210', '262-0032', '千葉県千葉市花見川区幕張町3-876-3', null, '043-296-3400', '043-296-3900', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0211', '若木ライフ', 'ワカギライフ', '若木ライフワカギライフ', '0211', '174-0065', '東京都板橋区若木1-21-3', null, '03-3933-3900', '03-3933-1955', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0212', 'アライブ荻窪', 'アライブオギクボ', 'アライブ荻窪アライブオギクボ', '0212', '167-0043', '東京都杉並区上荻3-21-11', null, '03-5311-3600', null, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0213', 'アズハイム町田', 'アズハイムマチダ', 'アズハイム町田アズハイムマチダ', '0213', '194-0034', '東京都町田市根岸町1009-7', null, '042-798-6541', null, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0214', 'ニチイケアセンター横浜戸塚', 'ニチイケアセンターヨコハマトツカ', 'ニチイケアセンター横浜戸塚ニチイケアセンターヨコハマトツカ', '0214', '245-0067', '神奈川県横浜市戸塚区深谷町1413-1', null, '045-851-2551', '045-852-1221', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0215', 'ニチイケアセンター港南台', 'ニチイケアセンターコウナンダイ', 'ニチイケアセンター港南台ニチイケアセンターコウナンダイ', '0215', '234-0054', '神奈川県横浜市港南区港南台4丁目27-3', null, '045-836-3501', '045-833-3511', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0216', '花物語あきしま', 'ハナモノガタリアキシマ', '花物語あきしまハナモノガタリアキシマ', '0216', '196-0014', '東京都昭島市田中町2丁目1番27号', null, '042-549-0022', '042-549-0018', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0217', '花物語ふっさ', 'ハナモノガタリフッサ', '花物語ふっさハナモノガタリフッサ', '0217', '197-0003', '東京都福生市大字熊川66番地ー1', null, '042-539-3587', '042-539-3588', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0218', 'トラストガーデン桜新町', 'トラストガーデンサクラシンマチ', 'トラストガーデン桜新町トラストガーデンサクラシンマチ', '0218', '154-0016', '東京都世田谷区弦巻2-11-1', null, '03-5451-7722', '03-5451-7723', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0219', 'ディーフェスタ西台', 'ディーフェスタニシダイ', 'ディーフェスタ西台ディーフェスタニシダイ', '0219', '1750045', '東京都板橋区西台2-24-15', null, '03-6694-4173', '03-6775-3886', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0220', 'はなことばプラス杉並上井草', 'ハナコトバプラススギナミカミイグサ', 'はなことばプラス杉並上井草ハナコトバプラススギナミカミイグサ', '0220', '167-0023', '東京都杉並区上井草3-4-5', null, '03-69133-6325', null, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0221', 'ネクサスコート本郷台', 'ネクサクコートホンゴウダイ', 'ネクサスコート本郷台ネクサクコートホンゴウダイ', '0221', '224-0842', '神奈川県横浜市栄区飯島町1382', null, '045-890-3030', '045-890-3033', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0222', '花物語たちかわ北', 'ハナモノガタリタチカワキタ', '花物語たちかわ北ハナモノガタリタチカワキタ', '0222', '190-0033', '東京都立川市一番町4-10-7', null, '042-520-0541', '042-520-0542', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0223', 'アライブ品川大井', 'アライブシナガワオオイ', 'アライブ品川大井アライブシナガワオオイ', '0223', '140-0014', '東京都品川区大井5-21-18', null, '03-5746-6220', '03-3776-1136', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0224', 'ウエルケアガーデン馬事公苑', 'ウエルケアガーデンバジコウエン', 'ウエルケアガーデン馬事公苑ウエルケアガーデンバジコウエン', '0224', '158-0098', '東京都世田谷区上用賀2-2-15', null, '03-5799-1601', '03-5799-1603', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0225', 'ミモザ横浜朝比奈', 'ミモザヨコハマアサヒナ', 'ミモザ横浜朝比奈ミモザヨコハマアサヒナ', '0225', '236-0033', '横浜市金沢区東朝比奈3-11-33', null, '045-781-0370', null, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0226', 'ソナーレ駒澤公園', 'ソナーレコマザワコウエン', 'ソナーレ駒澤公園ソナーレコマザワコウエン', '0226', '152-0021', '東京都目黒区東が丘1－35－22', null, '03-5787-6133', '03-5787-6134', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0227', 'ソナーレ・アテリア久我山', 'ソナーレアテリア久クガヤマ', 'ソナーレ・アテリア久我山ソナーレアテリア久クガヤマ', '0227', '181-0002', '東京都三鷹市牟礼1-3-15', null, '0422-26-8111', null, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0228', 'イリーゼ新座市役所前', 'イリーゼニイザシヤクショマエ', 'イリーゼ新座市役所前イリーゼニイザシヤクショマエ', '0228', '352-0011', '埼玉県新座市野火止1-2-4', null, '048-480-7061', null, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0229', 'ふれあい多居夢浦和', 'フレアイタイムウラワ', 'ふれあい多居夢浦和フレアイタイムウラワ', '0229', '330-0073', '埼玉県さいたま市浦和区元町1-32-17', null, '048-813-8192', '048-813-8193', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0230', 'ふれあい多居夢大宮', 'フレアイタイムオオミヤ', 'ふれあい多居夢大宮フレアイタイムオオミヤ', '0230', '331-0053', '埼玉県さいたま市西区植田谷本前通461-3', null, '048-620-6616', '048-620-6616', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0231', '愛の家 グループホーム 狭山', 'アイノイエグループホームサヤマ', '愛の家グループホーム狭山アイノイエグループホームサヤマ', '0231', '202-0013', '埼玉県狭山市北入曽281-2', null, '04-2999-6001', '04-2999-6002', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0232', 'リーシェガーデン大泉学園', 'リーシェガーデンオオイズミガクエン', 'リーシェガーデン大泉学園リーシェガーデンオオイズミガクエン', '0232', '178-0061', '東京都練馬区大泉学園町7-10-21', null, '03-6904-5530', '03-6904-5561', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0233', 'グループホーム　ピクト―ル', 'グループホームピクト―ル', 'グループホームピクト―ルグループホームピクト―ル', '0233', '359-0011', '埼玉県所沢市大字南永井591-4', null, '04-2936-9445', '04-2936-9446', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0234', 'ニチイケアセンター稲田堤', 'ニチイケアセンターイナダツツミ', 'ニチイケアセンター稲田堤ニチイケアセンターイナダツツミ', '0234', '214-0004', '神奈川県川崎市多摩区菅馬場2-10-10', null, '044-949-6061', null, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0235', 'ソナーレ目黒不動前', 'ソナーレメグロフドウマエ', 'ソナーレ目黒不動前ソナーレメグロフドウマエ', '0235', '153-0064', '東京都目黒区下目黒五丁目10番16号', null, '03-6451-2523', '03-6451-2533', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0236', 'はなことば追浜', 'ハナコトバオッパマ', 'はなことば追浜ハナコトバオッパマ', '0236', '237-0064', '神奈川県横須賀市追浜1-1-11', null, '046-874-6681', '146-874-6682', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0237', 'ネクサスコート湘南鷹取', 'ネクサクコートショウナンタカトリ', 'ネクサスコート湘南鷹取ネクサクコートショウナンタカトリ', '0237', '237-0066', '神奈川県横須賀市湘南鷹取2-35-5', null, '046-874-5121', '046-866-6810', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0238', '愛の家グループホーム宮前宮崎', 'アイノイエグループホームミヤザキミヤマエ', '愛の家グループホーム宮前宮崎アイノイエグループホームミヤザキミヤマエ', '0238', '216-0033', '神奈川県川崎市宮前区宮崎4-1-5', null, '044-870-3370', '044-870-3371', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0239', 'イリーゼ新所沢', 'イリーゼシントコロザワ', 'イリーゼ新所沢イリーゼシントコロザワ', '0239', '359-0001', '埼玉県所沢市大字下富522', null, '04-2943-8090', '04-2943-8091', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0240', 'イリーゼ武蔵藤沢', 'イリーゼムサシフジサワ', 'イリーゼ武蔵藤沢イリーゼムサシフジサワ', '0240', '358-0012', '埼玉県入間市東藤沢3-9-13', null, '042-963-9150', '042-963-9151', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0241', '愛の家グループホーム所沢小手指', 'アイノイエグループホームトコロザワコテサシ', '愛の家グループホーム所沢小手指アイノイエグループホームトコロザワコテサシ', '0241', '359-1147', '埼玉県所沢市小手指元町3-6-3', null, '04-2938-3510', '04-2938-3511', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0242', '愛の家グループホーム三芳竹間沢', 'アイノイエグループホームミヨシタケマザワ', '愛の家グループホーム三芳竹間沢アイノイエグループホームミヨシタケマザワ', '0242', '354-0043', '埼玉県入間郡三芳町竹間沢577-1', null, '049-274-5300', '049-274-5301', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0243', 'イリーゼ西大宮', 'イリーゼニシオオミヤ', 'イリーゼ西大宮イリーゼニシオオミヤ', '0243', '331-0052', '埼玉県さいたま市西区6-1235-1', null, '048-620-5011', '048-620-5012', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0244', 'ふれあい多居夢　蕨', 'フレアイタイムワラビ', 'ふれあい多居夢蕨フレアイタイムワラビ', '0244', '335-0004', '埼玉県蕨市中央3-15-22', null, '048-434-5335', '048-434-5336', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0245', '聖心会管区本部　第一修道院', 'セイシンカイカンクホンブダイイチシュウドウイン', '聖心会管区本部第一修道院セイシンカイカンクホンブダイイチシュウドウイン', '0245', '150-0012', '東京都渋谷区広尾4-3-1', null, '03-3499-2705', '03-3499-1253', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0246', '愛の家グループホーム川越今福', 'アイノイエグループホームカワゴエイマフク', '愛の家グループホーム川越今福アイノイエグループホームカワゴエイマフク', '0246', '350-1151', '埼玉県川越市大字今福729番地10', null, '049-238-8890', '049-238-8891', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0247', '愛の家グループホーム川越小ケ谷', 'アイノイエグループホームカワゴエオガヤ', '愛の家グループホーム川越小ケ谷アイノイエグループホームカワゴエオガヤ', '0247', '350-1104', '埼玉県川越市小ケ谷379-4', null, '049-249-0080', '049-249-0081', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0248', '愛の家グループホーム川越大塚新町', 'アイノイエグループホームカワゴエオオツカシンマチ', '愛の家グループホーム川越大塚新町アイノイエグループホームカワゴエオオツカシンマチ', '0248', '350-1178', '埼玉県川越市大塚新町15-1', null, '049-249-8560', '049-249-8561', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0249', 'アズハイム三鷹', 'アズハイムミタカ', 'アズハイム三鷹アズハイムミタカ', '0249', '181-0014', '東京都三鷹市野崎二丁目10番8号', null, '0422-26-1337', '0422-26-1339', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0250', 'アズハイム川崎中央', 'アズハイムカワサキチュウオウ', 'アズハイム川崎中央アズハイムカワサキチュウオウ', '0250', '213-0029', '神奈川県川崎市高津区東野川2-22-4', null, '044-766-8871', '044-766-8872', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0251', 'ローベル上井草', 'ローベルカミイグサ', 'ローベル上井草ローベルカミイグサ', '0251', '167-0023', '東京都杉並区上井草３丁目２５番４号', null, '03-6454-7383', null, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0252', '愛の家グループホーム川越的場', 'アイノイエグループホームカワゴエマトバ', '愛の家グループホーム川越的場アイノイエグループホームカワゴエマトバ', '0252', '350-1107', '埼玉県川越市的場新町19-5', null, '049-239-7210', '049-239-7230', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0253', '愛の家グループホーム川越山田', 'アイノイエグループホームカワゴエヤマダ', '愛の家グループホーム川越山田アイノイエグループホームカワゴエヤマダ', '0253', '350-0822', '埼玉県川越市大字山田291-1', null, '049-229-5560', '049-229-5561', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0254', '愛の家グループホーム鶴ヶ島三ツ木', 'アイノイエグループホームツルガシマミツギ', '愛の家グループホーム鶴ヶ島三ツ木アイノイエグループホームツルガシマミツギ', '0254', '350-2217', '埼玉県鶴ヶ島市三ツ木923-20', null, '049-279-0800', '049-279-0801', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0255', 'なごやかレジデンス東大泉', 'ナゴヤカレジデンスヒガシオオイズミ', 'なごやかレジデンス東大泉ナゴヤカレジデンスヒガシオオイズミ', '0255', '178-0063', '東京都練馬区東大泉1-20-44', null, '03-5905-3052', null, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0256', '愛の家グループホーム小平上水南', 'アイノイエグループホームコダイラカミジョウスイ', '愛の家グループホーム小平上水南アイノイエグループホームコダイラカミジョウスイ', '0256', '187-0021', '東京都小平市上水南町2-3-20', null, '042-320-5166', '042-320-5189', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0257', '愛の家グループホーム小平仲町', 'アイノイエグループホームコダイラコダイラナカマチ', '愛の家グループホーム小平仲町アイノイエグループホームコダイラコダイラナカマチ', '0257', '187-0042', '東京都小平市仲町327-1', null, '042-349-1580', '042-349-1581', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0258', '愛の家グループホーム国分寺本多', 'アイノイエグループホームコクブンジホンダ', '愛の家グループホーム国分寺本多アイノイエグループホームコクブンジホンダ', '0258', '185-0011', '東京都国分寺市本多2-15-15', null, '042-300-1260', '042-300-1261', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0259', '愛の家グループホーム飯能川寺', 'アイノイエグループホームハンノウカワデラ', '愛の家グループホーム飯能川寺アイノイエグループホームハンノウカワデラ', '0259', '357-0044', '埼玉県飯能市川寺12-1', null, '042-983-0080', '042-983-0081', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0260', '愛の家グループホーム西東京中町', 'アイノイエグループホームニシトウキョウナカマチ', '愛の家グループホーム西東京中町アイノイエグループホームニシトウキョウナカマチ', '0260', '202-0013', '東京都西東京市中町6-5-12', null, '042-438-8811', '042-438-8812', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0261', 'ウエルケアヒルズ馬事公苑', 'ウエルケアヒルズバジコウエン', 'ウエルケアヒルズ馬事公苑ウエルケアヒルズバジコウエン', '0261', '158-0098', '東京都世田谷区上用賀4-1-8', null, '03-5451-0221', null, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0262', 'サンライズヴィラ板橋向原', 'サンライズヴィライタバシムカイハラ', 'サンライズヴィラ板橋向原サンライズヴィライタバシムカイハラ', '0262', '173-0036', '東京都板橋区向原1-5-15', null, '03-6909-3685', '03-6909-3686', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0263', 'ココファン川﨑高津', 'ココファンカワサキタカツ', 'ココファン川﨑高津ココファンカワサキタカツ', '0263', '213-0025', '神奈川県川崎市高津区蟹ヶ谷265-5', null, '044-948-7018', '044-948-7048', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0264', '愛の家グループホーム川崎蟹ヶ谷', 'アイノイエグループホームカワサキカニガヤ', '愛の家グループホーム川崎蟹ヶ谷アイノイエグループホームカワサキカニガヤ', '0264', '213-0025', '神奈川県川崎市高津区蟹ケ谷265番地の5', null, '044-863-9360', '044-863-9361', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0265', 'ニチイケアセンターはるひ野', 'ニチイケアセンターハルヒノ', 'ニチイケアセンターはるひ野ニチイケアセンターハルヒノ', '0265', '215-0036', '神奈川県川崎市麻生区はるひ野1-3-16', null, '044-980-3061', '044-980-3062', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0266', 'ニチイケアセンター麻生黒川', 'ニチイケアセンターアソウクロカワ', 'ニチイケアセンター麻生黒川ニチイケアセンターアソウクロカワ', '0266', '215-0035', '神奈川県川崎市麻生区黒川27-1', null, '044-981-3166', '044-981-3167', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0267', 'イリーゼ練馬大泉学園', 'イリーゼネリマオオイズミガクエン', 'イリーゼ練馬大泉学園イリーゼネリマオオイズミガクエン', '0267', '178-0061', '東京都練馬区大泉学園町5-31-28', null, '03-5947-0062', '03-5947-0063', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0268', 'ニチイケアセンター都立大学', 'ニチイケアセンタートリツダイガク', 'ニチイケアセンター都立大学ニチイケアセンタートリツダイガク', '0268', '152-0032', '東京都目黒区平町1-10-15', null, '03-5731-9071', '03-5731-9072', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0269', '所沢グループホームそよ風', 'トコロザワグループホームソヨカゼ', '所沢グループホームそよ風トコロザワグループホームソヨカゼ', '0269', '359-1146', '埼玉県所沢市小手指南5-16-3', null, '04-2926-6960', '04-2926-6960', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0270', 'ファミニュー大森南', 'ファミニューオオモリミナミ', 'ファミニュー大森南ファミニューオオモリミナミ', '0270', '143-0013', '東京都大田区大森南3-10-4', null, '03-5705-4165', '03-5735-5153', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0271', 'アズハイム横浜上大岡', 'アズハイムヨコハマカミオオオカ', 'アズハイム横浜上大岡アズハイムヨコハマカミオオオカ', '0271', '232-0064', '神奈川県横浜市南区別所3丁目20番地16', null, '045-712-4370', '045-716-2490', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0272', 'はなことば練馬平和台', 'ハナコトバネリマヘイワダイ', 'はなことば練馬平和台ハナコトバネリマヘイワダイ', '0272', '179-0083', '東京都練馬区平和台4-20-3', null, '03-6906-6251', null, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0273', 'イリーゼ石神井公園', 'イリーゼシャクジイコウエン', 'イリーゼ石神井公園イリーゼシャクジイコウエン', '0273', '1770032', '東京都練馬区谷原5-10-6', null, '03-5910-5775', null, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0274', 'ソナーレアテリア大泉学園', 'ソナーレアテリアオオイズミガクエン', 'ソナーレアテリア大泉学園ソナーレアテリアオオイズミガクエン', '0274', '178-0063', '東京都練馬区東大泉6-48-3', null, '03-5935-7514', '03-5935-7516', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0275', 'イリーゼ練馬光が丘', 'イリーゼネリマヒカリガオカ', 'イリーゼ練馬光が丘イリーゼネリマヒカリガオカ', '0275', '179-0076', '東京都練馬区土支田1-14-10', null, '03-5910-5780', '03-5910-5781', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0276', 'ヒューマンライフケア三橋GH', 'ヒューマンライフケアミハシグループホーム', 'ヒューマンライフケア三橋GHヒューマンライフケアミハシグループホーム', '0276', '331-0052', '埼玉県さいたま市西区三橋5-1217-2', null, '048-811-1865', '048-881-7700', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0277', 'イリーゼ川越別邸', 'イリーゼカワゴエベッテイ', 'イリーゼ川越別邸イリーゼカワゴエベッテイ', '0277', '350-1151', '埼玉県川越市今福729-1', null, '049-238-2230', '048-238-2331', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0278', 'アズハイム横浜東寺尾', 'アズハイムヨコハマヒガシテラオ', 'アズハイム横浜東寺尾アズハイムヨコハマヒガシテラオ', '0278', '230-0077', '神奈川県横浜市鶴見区東寺尾2-23-19', null, '045-586-0971', '045-586-0980', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0279', 'イリーゼ横浜旭', 'イリーゼヨコハマアサヒ', 'イリーゼ横浜旭イリーゼヨコハマアサヒ', '0279', '241-0805', '神奈川県横浜市旭区都岡町41-6', null, '045-958-1071', '045-958-1072', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0280', 'アズハイム城東公園', 'アズハイムジョウトウコウエン', 'アズハイム城東公園アズハイムジョウトウコウエン', '0280', '136-0074', '東京都江東区東砂3－2－10', null, '03-6666-6241', '03-6666-6242', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0281', 'ふれあい多居夢志木宗岡', 'フレアイタイムシキムネオカ', 'ふれあい多居夢志木宗岡フレアイタイムシキムネオカ', '0281', '353-0002', '埼玉県志木市中宗岡4-6-20', null, '048-470-0064', '048-470-0065', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0282', 'carna国立', 'カルナクニタチ', 'carna国立カルナクニタチ', '0282', '186-0005', '東京都国立市西1-10-6', null, '042-501-3051', null, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0283', 'アズハイム品川', 'アズハイムシナガワ', 'アズハイム品川アズハイムシナガワ', '0283', '141-0033', '東京都品川区西品川3-6-21', null, '03-6431-8503', null, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0284', 'ぱんだ', 'パンダ', 'ぱんだパンダ', '0284', '210-0851', '神奈川県川崎市川崎区浜町2-19-15', null, '044-201-8744', '044-201-8755', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0285', 'ソラリス渡田', 'ソラリスワタリダ', 'ソラリス渡田ソラリスワタリダ', '0285', '210-0844', '神奈川県川崎市川崎区渡田新町1-9-3', null, '', null, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0286', 'ソラリス追分', 'ソラリスオイブン', 'ソラリス追分ソラリスオイブン', '0286', '210-0835', '神奈川県川崎市川崎区追分町17-2', null, '', null, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0287', 'にじ', 'ニジ', 'にじニジ', '0287', '210-0804', '神奈川県川崎市川崎区藤崎1-5-1', null, '', null, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0288', 'やまぶき', 'ヤマブキ', 'やまぶきヤマブキ', '0288', '212-0005', '神奈川県川崎市幸区戸手1-8-10', null, '', null, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0289', 'いずみ', 'イズミ', 'いずみイズミ', '0289', '210-0021', '神奈川県川崎市川崎区元木1-3-7', null, '', null, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0290', 'さくら', 'サクラ', 'さくらサクラ', '0290', '210-0833', '神奈川県川崎市川崎区桜本1-18-18', null, '', null, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0291', 'アズハイム大田中央', 'アズハイムオオタチュウオウ', 'アズハイム大田中央アズハイムオオタチュウオウ', '0291', '143-0024', '東京都大田区中央5-4-5', null, '', null, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0292', 'エルシアホスピス仙川', 'エルシアホスピスセンカワ', 'エルシアホスピス仙川エルシアホスピスセンカワ', '0292', '182-0003', '東京都調布市若葉町二丁目14番地1', null, '03-6909-1875', null, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0293', 'アシステッドリビング川越', 'アシステッドリビングカワゴエ', 'アシステッドリビング川越アシステッドリビングカワゴエ', '0293', '350-1101', '埼玉県川越市的場1174-1', null, '049-298-5012', null, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0294', 'ふれあい多居夢川越', 'フレアイタイムカワゴエ', 'ふれあい多居夢川越フレアイタイムカワゴエ', '0294', '350-0838', '埼玉県川越市宮元町4-10', null, '049-227-7446', '049-227-7447', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0295', 'ガーデンテラス砧公園', 'ガーデンテラスキヌタコウエン', 'ガーデンテラス砧公園ガーデンテラスキヌタコウエン', '0295', '158-0098', '東京都世田谷区上用賀5-25-23', null, '', null, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0296', 'セレニティホスピス東戸塚', 'セレニティホスピスヒガシトツカ', 'セレニティホスピス東戸塚セレニティホスピスヒガシトツカ', '0296', '232-0066', '神奈川県横浜市南区六ッ川4丁目1171', null, '045-719-5161', null, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0297', '愛の家グループホーム 大宮三橋', 'アイノイエグループホームオオミヤミツハシ', '愛の家グループホーム大宮三橋アイノイエグループホームオオミヤミツハシ', '0001', '330-0856', '埼玉県さいたま市大宮区三橋4-520-6', null, '048-620-2005', '048-620-2006', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0298', '愛の家グループホーム さいたま八王子', 'アイノイエグループホームサイタマハチオウジ', '愛の家グループホームさいたま八王子アイノイエグループホームサイタマハチオウジ', '0002', '338-0006', '埼玉県さいたま市中央区八王子3-11-8', null, '048-840-3560', '048-840-3561', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0299', '愛の家グループホーム さいたま山久保', 'アイノイエグループホームサイタマヤマクボ', '愛の家グループホームさいたま山久保アイノイエグループホームサイタマヤマクボ', '0003', '338-0821', '埼玉県さいたま市桜区山久保1-7-13', null, '048-840-6660', '048-840-6661', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0300', '愛の家グループホーム さいたま中島', 'アイノイエグループホームサイタマナカジマ', '愛の家グループホームさいたま中島アイノイエグループホームサイタマナカジマ', '0004', '338-0822', '埼玉県さいたま市桜区中島4-12-14', null, '048-840-1800', '048-840-1801', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0301', '愛の家グループホーム 南与野', 'アイノイエグループホームミナミヨノ', '愛の家グループホーム南与野アイノイエグループホームミナミヨノ', '0005', '338-0013', '埼玉県さいたま市中央区鈴谷1-24-1', null, '048-851-6488', '048-851-6489', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0302', 'アンサンブル大宮日進', 'アンサンブルオオミヤニッシン', 'アンサンブル大宮日進アンサンブルオオミヤニッシン', '0006', '331-0823', '埼玉県さいたま市北区日進町2-1914-1', null, '048-669-6300', '048-669-6330', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0303', 'アンサンブル大宮', 'アンサンブルオオミヤ', 'アンサンブル大宮アンサンブルオオミヤ', '0007', '330-0855', '埼玉県さいたま市大宮区上小町960-5', null, '048-650-0506', '048-650-0543', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0304', 'アンサンブル浦和', 'アンサンブルウラワ', 'アンサンブル浦和アンサンブルウラワ', '0008', '336-0963', '埼玉県さいたま市緑区大門1605-3', null, '048-919-5489', '048-812-1162', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0305', '愛の家グループホーム 大宮櫛引', 'アイノイエグループホームオオミヤクジヒキ', '愛の家グループホーム大宮櫛引アイノイエグループホームオオミヤクジヒキ', '0009', '331-0825', '埼玉県さいたま市北区櫛引町2-68-1', null, '048-661-5600', '048-661-5530', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0306', '愛の家グループホーム さいたま三室', 'アイノイエグループホームサイタマミムロ', '愛の家グループホームさいたま三室アイノイエグループホームサイタマミムロ', '0010', '336-0911', '埼玉県さいたま市緑区三室1161-3', null, '048-876-5270', '048-876-5271', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0307', '愛の家グループホーム 東浦和大間木', 'アイノイエグループホームヒガシウラワオオマキ', '愛の家グループホーム東浦和大間木アイノイエグループホームヒガシウラワオオマキ', '0011', '336-0926', '埼玉県さいたま市緑区東浦和9-9-9', null, '048-810-5720', '048-810-5721', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0308', '愛の家グループホーム 東浦和', 'アイノイエグループホームヒガシウラワ', '愛の家グループホーム東浦和アイノイエグループホームヒガシウラワ', '0012', '336-0042', '埼玉県さいたま市南区大谷口2369-1', null, '048-876-5100', '048-876-5101', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0309', '愛の家グループホーム 川口東内野', 'アイノイエグループホームカワグチヒガシウチノ', '愛の家グループホーム川口東内野アイノイエグループホームカワグチヒガシウチノ', '0013', '333-0821', '埼玉県川口市東内野293-1', null, '048-290-4145', '048-290-4146', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0310', '愛の家グループホーム川口戸塚', 'アイノイエグループホームカワグチトツカ', '愛の家グループホーム川口戸塚アイノイエグループホームカワグチトツカ', '0014', '333-0811', '埼玉県川口市戸塚5-16-3', null, '048-298-7238', '048-298-7364', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0311', '愛の家グループホーム 大宮指扇', 'アイノイエグループホームオオミヤサシオウギ', '愛の家グループホーム大宮指扇アイノイエグループホームオオミヤサシオウギ', '0015', '331-0047', '埼玉県さいたま市西区指扇566-1', null, '048-620-2850', '048-620-2851', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0312', '愛の家グループホーム 川口東領家', 'アイノイエグループホームカワグチヒガシリョウケ', '愛の家グループホーム川口東領家アイノイエグループホームカワグチヒガシリョウケ', '0016', '332-0003', '埼玉県川口市東領家1-10-17', null, '048-228-3220', '048-228-3222', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0313', '愛の家グループホーム 和光中央', 'アイノイエグループホームワコウチュウオウ', '愛の家グループホーム和光中央アイノイエグループホームワコウチュウオウ', '0017', '351-0113', '埼玉県和光市中央2-5-84', null, '048-450-0680', '048-450-0670', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0314', '愛の家グループホーム さいたま松本', 'アイノイエグループホームサイタマミムロマツモト', '愛の家グループホームさいたま松本アイノイエグループホームサイタマミムロマツモト', '0018', '336-0035', '埼玉県さいたま市南区松本4-18-3', null, '048-710-8010', '048-710-8011', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0315', '愛の家グループホーム戸田笹目', 'アイノイエグループホームトダササメ', '愛の家グループホーム戸田笹目アイノイエグループホームトダササメ', '0019', '335-0034', '埼玉県戸田市笹目1-29-18', null, '048-449-8700', '048-449-8701', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0316', '愛の家グループホーム 川口仲町', 'アイノイエグループホームカワグチナカチョウ', '愛の家グループホーム川口仲町アイノイエグループホームカワグチナカチョウ', '0020', '332-0022', '埼玉県川口市仲町13番13号', null, '048-240-3340', '048-240-3341', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0317', '愛の家グループホーム さいたま土呂', 'アイノイエグループホームサイタマトロ', '愛の家グループホームさいたま土呂アイノイエグループホームサイタマトロ', '0021', '331-0804', '埼玉県さいたま市北区土呂町2-86-4', null, '048-669-5200', '048-669-5201', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0318', '愛の家グループホーム 練馬早宮', 'アイノイエグループホームネリマハヤミヤ', '愛の家グループホーム練馬早宮アイノイエグループホームネリマハヤミヤ', '0022', '179-0085', '東京都練馬区早宮4-14-7', null, '03-5999-5221', '03-5999-5222', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0319', '愛の家グループホーム 足立堀之内', 'アイノイエグループホームアダチホリノウチ', '愛の家グループホーム足立堀之内アイノイエグループホームアダチホリノウチ', '0023', '123-0874', '東京都足立区堀之内2-3-17', null, '03-5838-1940', '03-5838-1941', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0320', '愛の家グループホーム 板橋高島平', 'アイノイエグループホームイタバシタカシマダイラ', '愛の家グループホーム板橋高島平アイノイエグループホームイタバシタカシマダイラ', '0024', '175-0082', '東京都板橋区高島平4-13-15', null, '03-5968-5560', '03-5968-5561', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0321', '愛の家グループホーム 板橋徳丸', 'アイノイエグループホームタイバシトクマル', '愛の家グループホーム板橋徳丸アイノイエグループホームタイバシトクマル', '0025', '175-0083', '東京都板橋区徳丸6-36-1', null, '03-5922-3133', '03-5922-3134', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0322', '愛の家グループホーム 練馬西大泉', 'アイノイエグループホームネリマヒガシオオイズミ', '愛の家グループホーム練馬西大泉アイノイエグループホームネリマヒガシオオイズミ', '0026', '178-0065', '東京都練馬区西大泉2-17-20', null, '03-5947-5270', '03-5947-5271', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0323', '愛の家グループホーム 新座東', 'アイノイエグループホームニイザヒガシ', '愛の家グループホーム新座東アイノイエグループホームニイザヒガシ', '0027', '352-0002', '埼玉県新座市東1-1-4', null, '048-480-5068', '048-480-5073', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0324', '愛の家グループホーム 上尾原市', 'アイノイエグループホームアゲオハラシ', '愛の家グループホーム上尾原市アイノイエグループホームアゲオハラシ', '0028', '362-0021', '埼玉県上尾市原市230-1', null, '048-720-1500', '048-720-1503', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0325', '愛の家グループホーム 八潮', 'アイノイエグループホームヤシオ', '愛の家グループホーム八潮アイノイエグループホームヤシオ', '0029', '340-0834', '埼玉県八潮市大曽根1273番地1', null, '048-994-2121', '048-994-2122', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0326', '愛の家グループホーム 大宮吉野町', 'アイノイエグループホームオオミヤヨシノチョウ', '愛の家グループホーム大宮吉野町アイノイエグループホームオオミヤヨシノチョウ', '0030', '331-0811', '埼玉県さいたま市北区吉野町2-263-4', null, '048-660-5700', '048-660-5702', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0327', '愛の家グループホーム 越谷相模', 'アイノイエグループホームコシガヤサガミ', '愛の家グループホーム越谷相模アイノイエグループホームコシガヤサガミ', '0031', '343-0823', '埼玉県越谷市相模町5-226-1', null, '048-990-7260', '048-990-7261', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0328', '愛の家グループホーム 越谷', 'アイノイエグループホームコシガヤ', '愛の家グループホーム越谷アイノイエグループホームコシガヤ', '0032', '343-0856', '埼玉県越谷市谷中町3-71-1', null, '048-969-5250', '048-969-5251', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0329', '愛の家グループホーム 岩槻城北', 'アイノイエグループホームイワツキジョウホク', '愛の家グループホーム岩槻城北アイノイエグループホームイワツキジョウホク', '0033', '339-0061', '埼玉県さいたま市岩槻区岩槻6796番地', null, '048-790-2611', '048-790-2612', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0330', '愛の家グループホーム 上尾本町', 'アイノイエグループホームアゲオホンチョウ', '愛の家グループホーム上尾本町アイノイエグループホームアゲオホンチョウ', '0034', '362-0014', '埼玉県上尾市本町5-9-23', null, '048-770-0020', '048-770-0021', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0331', '愛の家グループホーム 春日部一ノ割', 'アイノイエグループホームカスカベイチノワリ', '愛の家グループホーム春日部一ノ割アイノイエグループホームカスカベイチノワリ', '0035', '344-0031', '埼玉県春日部市一ノ割1000-4', null, '048-731-7000', '048-731-7001', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0332', '愛の家グループホーム 春日部豊春', 'アイノイエグループホームカスカベトモハル', '愛の家グループホーム春日部豊春アイノイエグループホームカスカベトモハル', '0036', '344-0046', '埼玉県春日部市上蛭田191番地4', null, '048-760-0280', '048-760-0281', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0333', '愛の家グループホーム 桶川', 'アイノイエグループホームオケガワ', '愛の家グループホーム桶川アイノイエグループホームオケガワ', '0037', '363-0023', '埼玉県桶川市朝日2-10-15', null, '048-778-6603', '048-778-6076', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0334', 'リーシェガーデン和光', 'リーシェガーデンワコウ', 'リーシェガーデン和光リーシェガーデンワコウ', '0038', '351-0112', '埼玉県和光市丸山台2-11-1', null, '048-485-9951', null, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0335', '特別養護老人ホーム フォレスト浦和', 'トクベツヨウゴロウジンホームフォレストウラワ', '特別養護老人ホームフォレスト浦和トクベツヨウゴロウジンホームフォレストウラワ', '0039', '330-0061', '埼玉県さいたま市浦和区常盤8-15-9', null, '048-621-1600', null, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0336', '特別養護老人ホーム あけみ苑', 'トクベツヨウゴロウジンホームアケミエン', '特別養護老人ホームあけみ苑トクベツヨウゴロウジンホームアケミエン', '0040', '336-0931', '埼玉県さいたま市緑区原山4-18-9', '特別養護老人ホーム', '048-886-1111', null, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0337', 'スマイルハウス', 'スマイルハウス', 'スマイルハウススマイルハウス', '0041', '336-0974', '埼玉県さいたま市緑区大崎2160番地', null, '048-878-2922', '048-878-2993', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0338', '愛の家グループホーム草加谷塚', 'アイノイエグループホームソウカヤツカ', '愛の家グループホーム草加谷塚アイノイエグループホームソウカヤツカ', '0042', '340-0023', '埼玉県草加市谷塚町1785-1', null, '048-920-0070', '048-920-0071', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0339', '愛の家グループホーム越谷平方', 'アイノイエグループホームコシガヤヒラカタ', '愛の家グループホーム越谷平方アイノイエグループホームコシガヤヒラカタ', '0043', '343-0002', '埼玉県越谷市平方立野2254', null, '048-970-2500', '048-970-2501', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0340', 'イリス指扇', 'イリスサシオウギ', 'イリス指扇イリスサシオウギ', '0044', '331-0047', '埼玉県さいたま市西区指扇1277-11', null, '048-621-1600', null, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0341', '大宮明生苑', 'オオミヤメイセイエン', '大宮明生苑オオミヤメイセイエン', '0045', '331-0825', '埼玉県さいたま市北区櫛引町2-327', null, '048-661-0808', '048-661-0801', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0342', '緑水苑指扇', 'リョクスイエンサシオウギ', '緑水苑指扇リョクスイエンサシオウギ', '0046', '331-0047', '埼玉県さいたま市西区指扇1570-2', null, '048-620-7510', '048-620-7511', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0343', 'デュオセーヌ大宮', 'デュオセーヌオオミヤ', 'デュオセーヌ大宮デュオセーヌオオミヤ', '0047', '331-0815', '埼玉県さいたま市北区4-416-1', null, '', null, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0344', 'フォレスト指扇', 'フォレストサシオウギ', 'フォレスト指扇フォレストサシオウギ', '0048', '331-0047', '埼玉県さいたま市西区指扇1277-11', null, '048-621-1600', '048-621-1601', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0345', 'フルーレ指扇', 'フルーレサシオウギ', 'フルーレ指扇フルーレサシオウギ', '0049', '331-0047', '埼玉県さいたま市西区指扇1377-1', null, '048-782-5862', '048-782-5502', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0346', 'フォルテ―ラ指扇', 'フォルテ―ラサシオウギ', 'フォルテ―ラ指扇フォルテ―ラサシオウギ', '0050', '331-0047', '埼玉県さいたま市西区指扇1377-1', null, '048-782-6828', '048-782-5502', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0347', '愛の家グループホーム上尾浅間台', 'アイノイエグループホームアゲオアサマダイ', '愛の家グループホーム上尾浅間台アイノイエグループホームアゲオアサマダイ', '0051', '362-0073', '埼玉県上尾市浅間台1-1-7', null, '048-729-7460', '048-729‐7461', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0348', 'ナーシングホーム日和高木', 'ナーシングホームヒヨリタカギ', 'ナーシングホーム日和高木ナーシングホームヒヨリタカギ', '0052', '331-0071', '埼玉県さいたま市西区高木266', null, '048-782-7440', '048-729-4710', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null),
  ('0000000000000000000F0349', 'あやめの郷', 'アヤメノサト', 'あやめの郷アヤメノサト', '0053', '000-0000', '★「あやめの郷」だけでは特定できないため未設定', null, '000-000-0000', null, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001',null);

-- 施設コード管理（シーケンス番号の初期値は患者データの移行ツールで設定する予定）
insert into health_facility_code_manage
  (id, health_facility_code_group_id, health_facility_id, code, sequence_no, created_at, created_by, updated_at, updated_by)
values
  ('00000000000000000FCM0001', '00000000000000000FCG0001', '0000000000000000000F0001', '0001', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0002', '00000000000000000FCG0001', '0000000000000000000F0002', '0002', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0003', '00000000000000000FCG0001', '0000000000000000000F0003', '0003', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0004', '00000000000000000FCG0001', '0000000000000000000F0004', '0004', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0005', '00000000000000000FCG0001', '0000000000000000000F0005', '0005', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0006', '00000000000000000FCG0001', '0000000000000000000F0006', '0006', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0007', '00000000000000000FCG0001', '0000000000000000000F0007', '0007', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0008', '00000000000000000FCG0001', '0000000000000000000F0008', '0008', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0009', '00000000000000000FCG0001', '0000000000000000000F0009', '0009', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0010', '00000000000000000FCG0001', '0000000000000000000F0010', '0010', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0011', '00000000000000000FCG0001', '0000000000000000000F0011', '0011', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0012', '00000000000000000FCG0001', '0000000000000000000F0012', '0012', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0013', '00000000000000000FCG0001', '0000000000000000000F0013', '0013', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0014', '00000000000000000FCG0001', '0000000000000000000F0014', '0014', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0015', '00000000000000000FCG0001', '0000000000000000000F0015', '0015', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0016', '00000000000000000FCG0001', '0000000000000000000F0016', '0016', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0017', '00000000000000000FCG0001', '0000000000000000000F0017', '0017', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0018', '00000000000000000FCG0001', '0000000000000000000F0018', '0018', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0019', '00000000000000000FCG0001', '0000000000000000000F0019', '0019', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0020', '00000000000000000FCG0001', '0000000000000000000F0020', '0020', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0021', '00000000000000000FCG0001', '0000000000000000000F0021', '0021', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0022', '00000000000000000FCG0001', '0000000000000000000F0022', '0022', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0023', '00000000000000000FCG0001', '0000000000000000000F0023', '0023', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0024', '00000000000000000FCG0001', '0000000000000000000F0024', '0024', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0025', '00000000000000000FCG0001', '0000000000000000000F0025', '0025', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0026', '00000000000000000FCG0001', '0000000000000000000F0026', '0026', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0027', '00000000000000000FCG0001', '0000000000000000000F0027', '0027', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0028', '00000000000000000FCG0001', '0000000000000000000F0028', '0028', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0029', '00000000000000000FCG0001', '0000000000000000000F0029', '0029', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0030', '00000000000000000FCG0001', '0000000000000000000F0030', '0030', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0031', '00000000000000000FCG0001', '0000000000000000000F0031', '0031', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0032', '00000000000000000FCG0001', '0000000000000000000F0032', '0032', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0033', '00000000000000000FCG0001', '0000000000000000000F0033', '0033', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0034', '00000000000000000FCG0001', '0000000000000000000F0034', '0034', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0035', '00000000000000000FCG0001', '0000000000000000000F0035', '0035', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0036', '00000000000000000FCG0001', '0000000000000000000F0036', '0036', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0037', '00000000000000000FCG0001', '0000000000000000000F0037', '0037', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0038', '00000000000000000FCG0001', '0000000000000000000F0038', '0038', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0039', '00000000000000000FCG0001', '0000000000000000000F0039', '0039', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0040', '00000000000000000FCG0001', '0000000000000000000F0040', '0040', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0041', '00000000000000000FCG0001', '0000000000000000000F0041', '0041', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0042', '00000000000000000FCG0001', '0000000000000000000F0042', '0042', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0043', '00000000000000000FCG0001', '0000000000000000000F0043', '0043', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0044', '00000000000000000FCG0001', '0000000000000000000F0044', '0044', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0045', '00000000000000000FCG0001', '0000000000000000000F0045', '0045', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0046', '00000000000000000FCG0001', '0000000000000000000F0046', '0046', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0047', '00000000000000000FCG0001', '0000000000000000000F0047', '0047', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0048', '00000000000000000FCG0001', '0000000000000000000F0048', '0048', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0049', '00000000000000000FCG0001', '0000000000000000000F0049', '0049', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0050', '00000000000000000FCG0001', '0000000000000000000F0050', '0050', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0051', '00000000000000000FCG0001', '0000000000000000000F0051', '0051', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0052', '00000000000000000FCG0001', '0000000000000000000F0052', '0052', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0053', '00000000000000000FCG0001', '0000000000000000000F0053', '0053', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0054', '00000000000000000FCG0001', '0000000000000000000F0054', '0054', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0055', '00000000000000000FCG0001', '0000000000000000000F0055', '0055', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0056', '00000000000000000FCG0001', '0000000000000000000F0056', '0056', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0057', '00000000000000000FCG0001', '0000000000000000000F0057', '0057', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0058', '00000000000000000FCG0001', '0000000000000000000F0058', '0058', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0059', '00000000000000000FCG0001', '0000000000000000000F0059', '0059', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0060', '00000000000000000FCG0001', '0000000000000000000F0060', '0060', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0061', '00000000000000000FCG0001', '0000000000000000000F0061', '0061', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0062', '00000000000000000FCG0001', '0000000000000000000F0062', '0062', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0063', '00000000000000000FCG0001', '0000000000000000000F0063', '0063', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0064', '00000000000000000FCG0001', '0000000000000000000F0064', '0064', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0065', '00000000000000000FCG0001', '0000000000000000000F0065', '0065', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0066', '00000000000000000FCG0001', '0000000000000000000F0066', '0066', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0067', '00000000000000000FCG0001', '0000000000000000000F0067', '0067', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0068', '00000000000000000FCG0001', '0000000000000000000F0068', '0068', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0069', '00000000000000000FCG0001', '0000000000000000000F0069', '0069', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0070', '00000000000000000FCG0001', '0000000000000000000F0070', '0070', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0071', '00000000000000000FCG0001', '0000000000000000000F0071', '0071', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0072', '00000000000000000FCG0001', '0000000000000000000F0072', '0072', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0073', '00000000000000000FCG0001', '0000000000000000000F0073', '0073', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0074', '00000000000000000FCG0001', '0000000000000000000F0074', '0074', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0075', '00000000000000000FCG0001', '0000000000000000000F0075', '0075', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0076', '00000000000000000FCG0001', '0000000000000000000F0076', '0076', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0077', '00000000000000000FCG0001', '0000000000000000000F0077', '0077', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0078', '00000000000000000FCG0001', '0000000000000000000F0078', '0078', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0079', '00000000000000000FCG0001', '0000000000000000000F0079', '0079', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0080', '00000000000000000FCG0001', '0000000000000000000F0080', '0080', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0081', '00000000000000000FCG0001', '0000000000000000000F0081', '0081', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0082', '00000000000000000FCG0001', '0000000000000000000F0082', '0082', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0083', '00000000000000000FCG0001', '0000000000000000000F0083', '0083', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0084', '00000000000000000FCG0001', '0000000000000000000F0084', '0084', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0085', '00000000000000000FCG0001', '0000000000000000000F0085', '0085', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0086', '00000000000000000FCG0001', '0000000000000000000F0086', '0086', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0087', '00000000000000000FCG0001', '0000000000000000000F0087', '0087', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0088', '00000000000000000FCG0001', '0000000000000000000F0088', '0088', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0089', '00000000000000000FCG0001', '0000000000000000000F0089', '0089', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0090', '00000000000000000FCG0001', '0000000000000000000F0090', '0090', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0091', '00000000000000000FCG0001', '0000000000000000000F0091', '0091', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0092', '00000000000000000FCG0001', '0000000000000000000F0092', '0092', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0093', '00000000000000000FCG0001', '0000000000000000000F0093', '0093', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0094', '00000000000000000FCG0001', '0000000000000000000F0094', '0094', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0095', '00000000000000000FCG0001', '0000000000000000000F0095', '0095', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0096', '00000000000000000FCG0001', '0000000000000000000F0096', '0096', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0097', '00000000000000000FCG0001', '0000000000000000000F0097', '0097', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0098', '00000000000000000FCG0001', '0000000000000000000F0098', '0098', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0099', '00000000000000000FCG0001', '0000000000000000000F0099', '0099', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0100', '00000000000000000FCG0001', '0000000000000000000F0100', '0100', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0101', '00000000000000000FCG0001', '0000000000000000000F0101', '0101', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0102', '00000000000000000FCG0001', '0000000000000000000F0102', '0102', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0103', '00000000000000000FCG0001', '0000000000000000000F0103', '0103', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0104', '00000000000000000FCG0001', '0000000000000000000F0104', '0104', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0105', '00000000000000000FCG0001', '0000000000000000000F0105', '0105', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0106', '00000000000000000FCG0001', '0000000000000000000F0106', '0106', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0107', '00000000000000000FCG0001', '0000000000000000000F0107', '0107', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0108', '00000000000000000FCG0001', '0000000000000000000F0108', '0108', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0109', '00000000000000000FCG0001', '0000000000000000000F0109', '0109', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0110', '00000000000000000FCG0001', '0000000000000000000F0110', '0110', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0111', '00000000000000000FCG0001', '0000000000000000000F0111', '0111', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0112', '00000000000000000FCG0001', '0000000000000000000F0112', '0112', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0113', '00000000000000000FCG0001', '0000000000000000000F0113', '0113', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0114', '00000000000000000FCG0001', '0000000000000000000F0114', '0114', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0115', '00000000000000000FCG0001', '0000000000000000000F0115', '0115', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0116', '00000000000000000FCG0001', '0000000000000000000F0116', '0116', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0117', '00000000000000000FCG0001', '0000000000000000000F0117', '0117', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0118', '00000000000000000FCG0001', '0000000000000000000F0118', '0118', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0119', '00000000000000000FCG0001', '0000000000000000000F0119', '0119', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0120', '00000000000000000FCG0001', '0000000000000000000F0120', '0120', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0121', '00000000000000000FCG0001', '0000000000000000000F0121', '0121', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0122', '00000000000000000FCG0001', '0000000000000000000F0122', '0122', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0123', '00000000000000000FCG0001', '0000000000000000000F0123', '0123', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0124', '00000000000000000FCG0001', '0000000000000000000F0124', '0124', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0125', '00000000000000000FCG0001', '0000000000000000000F0125', '0125', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0126', '00000000000000000FCG0001', '0000000000000000000F0126', '0126', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0127', '00000000000000000FCG0001', '0000000000000000000F0127', '0127', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0128', '00000000000000000FCG0001', '0000000000000000000F0128', '0128', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0129', '00000000000000000FCG0001', '0000000000000000000F0129', '0129', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0130', '00000000000000000FCG0001', '0000000000000000000F0130', '0130', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0131', '00000000000000000FCG0001', '0000000000000000000F0131', '0131', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0132', '00000000000000000FCG0001', '0000000000000000000F0132', '0132', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0133', '00000000000000000FCG0001', '0000000000000000000F0133', '0133', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0134', '00000000000000000FCG0001', '0000000000000000000F0134', '0134', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0135', '00000000000000000FCG0001', '0000000000000000000F0135', '0135', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0136', '00000000000000000FCG0001', '0000000000000000000F0136', '0136', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0137', '00000000000000000FCG0001', '0000000000000000000F0137', '0137', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0138', '00000000000000000FCG0001', '0000000000000000000F0138', '0138', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0139', '00000000000000000FCG0001', '0000000000000000000F0139', '0139', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0140', '00000000000000000FCG0001', '0000000000000000000F0140', '0140', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0141', '00000000000000000FCG0001', '0000000000000000000F0141', '0141', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0142', '00000000000000000FCG0001', '0000000000000000000F0142', '0142', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0143', '00000000000000000FCG0001', '0000000000000000000F0143', '0143', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0144', '00000000000000000FCG0001', '0000000000000000000F0144', '0144', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0145', '00000000000000000FCG0001', '0000000000000000000F0145', '0145', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0146', '00000000000000000FCG0001', '0000000000000000000F0146', '0146', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0147', '00000000000000000FCG0001', '0000000000000000000F0147', '0147', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0148', '00000000000000000FCG0001', '0000000000000000000F0148', '0148', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0149', '00000000000000000FCG0001', '0000000000000000000F0149', '0149', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0150', '00000000000000000FCG0001', '0000000000000000000F0150', '0150', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0151', '00000000000000000FCG0001', '0000000000000000000F0151', '0151', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0152', '00000000000000000FCG0001', '0000000000000000000F0152', '0152', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0153', '00000000000000000FCG0001', '0000000000000000000F0153', '0153', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0154', '00000000000000000FCG0001', '0000000000000000000F0154', '0154', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0155', '00000000000000000FCG0001', '0000000000000000000F0155', '0155', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0156', '00000000000000000FCG0001', '0000000000000000000F0156', '0156', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0157', '00000000000000000FCG0001', '0000000000000000000F0157', '0157', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0158', '00000000000000000FCG0001', '0000000000000000000F0158', '0158', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0159', '00000000000000000FCG0001', '0000000000000000000F0159', '0159', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0160', '00000000000000000FCG0001', '0000000000000000000F0160', '0160', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0161', '00000000000000000FCG0001', '0000000000000000000F0161', '0161', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0162', '00000000000000000FCG0001', '0000000000000000000F0162', '0162', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0163', '00000000000000000FCG0001', '0000000000000000000F0163', '0163', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0164', '00000000000000000FCG0001', '0000000000000000000F0164', '0164', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0165', '00000000000000000FCG0001', '0000000000000000000F0165', '0165', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0166', '00000000000000000FCG0001', '0000000000000000000F0166', '0166', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0167', '00000000000000000FCG0001', '0000000000000000000F0167', '0167', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0168', '00000000000000000FCG0001', '0000000000000000000F0168', '0168', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0169', '00000000000000000FCG0001', '0000000000000000000F0169', '0169', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0170', '00000000000000000FCG0001', '0000000000000000000F0170', '0170', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0171', '00000000000000000FCG0001', '0000000000000000000F0171', '0171', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0172', '00000000000000000FCG0001', '0000000000000000000F0172', '0172', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0173', '00000000000000000FCG0001', '0000000000000000000F0173', '0173', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0174', '00000000000000000FCG0001', '0000000000000000000F0174', '0174', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0175', '00000000000000000FCG0001', '0000000000000000000F0175', '0175', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0176', '00000000000000000FCG0001', '0000000000000000000F0176', '0176', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0177', '00000000000000000FCG0001', '0000000000000000000F0177', '0177', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0178', '00000000000000000FCG0001', '0000000000000000000F0178', '0178', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0179', '00000000000000000FCG0001', '0000000000000000000F0179', '0179', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0180', '00000000000000000FCG0001', '0000000000000000000F0180', '0180', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0181', '00000000000000000FCG0001', '0000000000000000000F0181', '0181', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0182', '00000000000000000FCG0001', '0000000000000000000F0182', '0182', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0183', '00000000000000000FCG0001', '0000000000000000000F0183', '0183', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0184', '00000000000000000FCG0001', '0000000000000000000F0184', '0184', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0185', '00000000000000000FCG0001', '0000000000000000000F0185', '0185', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0186', '00000000000000000FCG0001', '0000000000000000000F0186', '0186', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0187', '00000000000000000FCG0001', '0000000000000000000F0187', '0187', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0188', '00000000000000000FCG0001', '0000000000000000000F0188', '0188', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0189', '00000000000000000FCG0001', '0000000000000000000F0189', '0189', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0190', '00000000000000000FCG0001', '0000000000000000000F0190', '0190', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0191', '00000000000000000FCG0001', '0000000000000000000F0191', '0191', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0192', '00000000000000000FCG0001', '0000000000000000000F0192', '0192', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0193', '00000000000000000FCG0001', '0000000000000000000F0193', '0193', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0194', '00000000000000000FCG0001', '0000000000000000000F0194', '0194', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0195', '00000000000000000FCG0001', '0000000000000000000F0195', '0195', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0196', '00000000000000000FCG0001', '0000000000000000000F0196', '0196', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0197', '00000000000000000FCG0001', '0000000000000000000F0197', '0197', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0198', '00000000000000000FCG0001', '0000000000000000000F0198', '0198', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0199', '00000000000000000FCG0001', '0000000000000000000F0199', '0199', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0200', '00000000000000000FCG0001', '0000000000000000000F0200', '0200', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0201', '00000000000000000FCG0001', '0000000000000000000F0201', '0201', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0202', '00000000000000000FCG0001', '0000000000000000000F0202', '0202', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0203', '00000000000000000FCG0001', '0000000000000000000F0203', '0203', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0204', '00000000000000000FCG0001', '0000000000000000000F0204', '0204', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0205', '00000000000000000FCG0001', '0000000000000000000F0205', '0205', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0206', '00000000000000000FCG0001', '0000000000000000000F0206', '0206', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0207', '00000000000000000FCG0001', '0000000000000000000F0207', '0207', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0208', '00000000000000000FCG0001', '0000000000000000000F0208', '0208', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0209', '00000000000000000FCG0001', '0000000000000000000F0209', '0209', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0210', '00000000000000000FCG0001', '0000000000000000000F0210', '0210', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0211', '00000000000000000FCG0001', '0000000000000000000F0211', '0211', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0212', '00000000000000000FCG0001', '0000000000000000000F0212', '0212', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0213', '00000000000000000FCG0001', '0000000000000000000F0213', '0213', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0214', '00000000000000000FCG0001', '0000000000000000000F0214', '0214', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0215', '00000000000000000FCG0001', '0000000000000000000F0215', '0215', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0216', '00000000000000000FCG0001', '0000000000000000000F0216', '0216', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0217', '00000000000000000FCG0001', '0000000000000000000F0217', '0217', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0218', '00000000000000000FCG0001', '0000000000000000000F0218', '0218', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0219', '00000000000000000FCG0001', '0000000000000000000F0219', '0219', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0220', '00000000000000000FCG0001', '0000000000000000000F0220', '0220', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0221', '00000000000000000FCG0001', '0000000000000000000F0221', '0221', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0222', '00000000000000000FCG0001', '0000000000000000000F0222', '0222', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0223', '00000000000000000FCG0001', '0000000000000000000F0223', '0223', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0224', '00000000000000000FCG0001', '0000000000000000000F0224', '0224', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0225', '00000000000000000FCG0001', '0000000000000000000F0225', '0225', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0226', '00000000000000000FCG0001', '0000000000000000000F0226', '0226', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0227', '00000000000000000FCG0001', '0000000000000000000F0227', '0227', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0228', '00000000000000000FCG0001', '0000000000000000000F0228', '0228', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0229', '00000000000000000FCG0001', '0000000000000000000F0229', '0229', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0230', '00000000000000000FCG0001', '0000000000000000000F0230', '0230', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0231', '00000000000000000FCG0001', '0000000000000000000F0231', '0231', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0232', '00000000000000000FCG0001', '0000000000000000000F0232', '0232', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0233', '00000000000000000FCG0001', '0000000000000000000F0233', '0233', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0234', '00000000000000000FCG0001', '0000000000000000000F0234', '0234', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0235', '00000000000000000FCG0001', '0000000000000000000F0235', '0235', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0236', '00000000000000000FCG0001', '0000000000000000000F0236', '0236', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0237', '00000000000000000FCG0001', '0000000000000000000F0237', '0237', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0238', '00000000000000000FCG0001', '0000000000000000000F0238', '0238', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0239', '00000000000000000FCG0001', '0000000000000000000F0239', '0239', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0240', '00000000000000000FCG0001', '0000000000000000000F0240', '0240', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0241', '00000000000000000FCG0001', '0000000000000000000F0241', '0241', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0242', '00000000000000000FCG0001', '0000000000000000000F0242', '0242', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0243', '00000000000000000FCG0001', '0000000000000000000F0243', '0243', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0244', '00000000000000000FCG0001', '0000000000000000000F0244', '0244', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0245', '00000000000000000FCG0001', '0000000000000000000F0245', '0245', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0246', '00000000000000000FCG0001', '0000000000000000000F0246', '0246', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0247', '00000000000000000FCG0001', '0000000000000000000F0247', '0247', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0248', '00000000000000000FCG0001', '0000000000000000000F0248', '0248', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0249', '00000000000000000FCG0001', '0000000000000000000F0249', '0249', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0250', '00000000000000000FCG0001', '0000000000000000000F0250', '0250', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0251', '00000000000000000FCG0001', '0000000000000000000F0251', '0251', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0252', '00000000000000000FCG0001', '0000000000000000000F0252', '0252', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0253', '00000000000000000FCG0001', '0000000000000000000F0253', '0253', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0254', '00000000000000000FCG0001', '0000000000000000000F0254', '0254', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0255', '00000000000000000FCG0001', '0000000000000000000F0255', '0255', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0256', '00000000000000000FCG0001', '0000000000000000000F0256', '0256', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0257', '00000000000000000FCG0001', '0000000000000000000F0257', '0257', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0258', '00000000000000000FCG0001', '0000000000000000000F0258', '0258', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0259', '00000000000000000FCG0001', '0000000000000000000F0259', '0259', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0260', '00000000000000000FCG0001', '0000000000000000000F0260', '0260', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0261', '00000000000000000FCG0001', '0000000000000000000F0261', '0261', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0262', '00000000000000000FCG0001', '0000000000000000000F0262', '0262', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0263', '00000000000000000FCG0001', '0000000000000000000F0263', '0263', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0264', '00000000000000000FCG0001', '0000000000000000000F0264', '0264', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0265', '00000000000000000FCG0001', '0000000000000000000F0265', '0265', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0266', '00000000000000000FCG0001', '0000000000000000000F0266', '0266', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0267', '00000000000000000FCG0001', '0000000000000000000F0267', '0267', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0268', '00000000000000000FCG0001', '0000000000000000000F0268', '0268', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0269', '00000000000000000FCG0001', '0000000000000000000F0269', '0269', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0270', '00000000000000000FCG0001', '0000000000000000000F0270', '0270', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0271', '00000000000000000FCG0001', '0000000000000000000F0271', '0271', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0272', '00000000000000000FCG0001', '0000000000000000000F0272', '0272', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0273', '00000000000000000FCG0001', '0000000000000000000F0273', '0273', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0274', '00000000000000000FCG0001', '0000000000000000000F0274', '0274', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0275', '00000000000000000FCG0001', '0000000000000000000F0275', '0275', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0276', '00000000000000000FCG0001', '0000000000000000000F0276', '0276', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0277', '00000000000000000FCG0001', '0000000000000000000F0277', '0277', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0278', '00000000000000000FCG0001', '0000000000000000000F0278', '0278', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0279', '00000000000000000FCG0001', '0000000000000000000F0279', '0279', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0280', '00000000000000000FCG0001', '0000000000000000000F0280', '0280', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0281', '00000000000000000FCG0001', '0000000000000000000F0281', '0281', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0282', '00000000000000000FCG0001', '0000000000000000000F0282', '0282', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0283', '00000000000000000FCG0001', '0000000000000000000F0283', '0283', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0284', '00000000000000000FCG0001', '0000000000000000000F0284', '0284', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0285', '00000000000000000FCG0001', '0000000000000000000F0285', '0285', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0286', '00000000000000000FCG0001', '0000000000000000000F0286', '0286', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0287', '00000000000000000FCG0001', '0000000000000000000F0287', '0287', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0288', '00000000000000000FCG0001', '0000000000000000000F0288', '0288', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0289', '00000000000000000FCG0001', '0000000000000000000F0289', '0289', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0290', '00000000000000000FCG0001', '0000000000000000000F0290', '0290', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0291', '00000000000000000FCG0001', '0000000000000000000F0291', '0291', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0292', '00000000000000000FCG0001', '0000000000000000000F0292', '0292', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0293', '00000000000000000FCG0001', '0000000000000000000F0293', '0293', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0294', '00000000000000000FCG0001', '0000000000000000000F0294', '0294', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0295', '00000000000000000FCG0001', '0000000000000000000F0295', '0295', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0296', '00000000000000000FCG0001', '0000000000000000000F0296', '0296', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0297', '00000000000000000FCG0002', '0000000000000000000F0297', '0001', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0298', '00000000000000000FCG0002', '0000000000000000000F0298', '0002', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0299', '00000000000000000FCG0002', '0000000000000000000F0299', '0003', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0300', '00000000000000000FCG0002', '0000000000000000000F0300', '0004', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0301', '00000000000000000FCG0002', '0000000000000000000F0301', '0005', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0302', '00000000000000000FCG0002', '0000000000000000000F0302', '0006', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0303', '00000000000000000FCG0002', '0000000000000000000F0303', '0007', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0304', '00000000000000000FCG0002', '0000000000000000000F0304', '0008', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0305', '00000000000000000FCG0002', '0000000000000000000F0305', '0009', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0306', '00000000000000000FCG0002', '0000000000000000000F0306', '0010', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0307', '00000000000000000FCG0002', '0000000000000000000F0307', '0011', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0308', '00000000000000000FCG0002', '0000000000000000000F0308', '0012', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0309', '00000000000000000FCG0002', '0000000000000000000F0309', '0013', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0310', '00000000000000000FCG0002', '0000000000000000000F0310', '0014', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0311', '00000000000000000FCG0002', '0000000000000000000F0311', '0015', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0312', '00000000000000000FCG0002', '0000000000000000000F0312', '0016', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0313', '00000000000000000FCG0002', '0000000000000000000F0313', '0017', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0314', '00000000000000000FCG0002', '0000000000000000000F0314', '0018', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0315', '00000000000000000FCG0002', '0000000000000000000F0315', '0019', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0316', '00000000000000000FCG0002', '0000000000000000000F0316', '0020', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0317', '00000000000000000FCG0002', '0000000000000000000F0317', '0021', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0318', '00000000000000000FCG0002', '0000000000000000000F0318', '0022', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0319', '00000000000000000FCG0002', '0000000000000000000F0319', '0023', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0320', '00000000000000000FCG0002', '0000000000000000000F0320', '0024', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0321', '00000000000000000FCG0002', '0000000000000000000F0321', '0025', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0322', '00000000000000000FCG0002', '0000000000000000000F0322', '0026', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0323', '00000000000000000FCG0002', '0000000000000000000F0323', '0027', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0324', '00000000000000000FCG0002', '0000000000000000000F0324', '0028', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0325', '00000000000000000FCG0002', '0000000000000000000F0325', '0029', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0326', '00000000000000000FCG0002', '0000000000000000000F0326', '0030', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0327', '00000000000000000FCG0002', '0000000000000000000F0327', '0031', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0328', '00000000000000000FCG0002', '0000000000000000000F0328', '0032', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0329', '00000000000000000FCG0002', '0000000000000000000F0329', '0033', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0330', '00000000000000000FCG0002', '0000000000000000000F0330', '0034', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0331', '00000000000000000FCG0002', '0000000000000000000F0331', '0035', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0332', '00000000000000000FCG0002', '0000000000000000000F0332', '0036', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0333', '00000000000000000FCG0002', '0000000000000000000F0333', '0037', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0334', '00000000000000000FCG0002', '0000000000000000000F0334', '0038', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0335', '00000000000000000FCG0002', '0000000000000000000F0335', '0039', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0336', '00000000000000000FCG0002', '0000000000000000000F0336', '0040', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0337', '00000000000000000FCG0002', '0000000000000000000F0337', '0041', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0338', '00000000000000000FCG0002', '0000000000000000000F0338', '0042', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0339', '00000000000000000FCG0002', '0000000000000000000F0339', '0043', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0340', '00000000000000000FCG0002', '0000000000000000000F0340', '0044', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0341', '00000000000000000FCG0002', '0000000000000000000F0341', '0045', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0342', '00000000000000000FCG0002', '0000000000000000000F0342', '0046', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0343', '00000000000000000FCG0002', '0000000000000000000F0343', '0047', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0344', '00000000000000000FCG0002', '0000000000000000000F0344', '0048', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0345', '00000000000000000FCG0002', '0000000000000000000F0345', '0049', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0346', '00000000000000000FCG0002', '0000000000000000000F0346', '0050', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0347', '00000000000000000FCG0002', '0000000000000000000F0347', '0051', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0348', '00000000000000000FCG0002', '0000000000000000000F0348', '0052', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('00000000000000000FCM0349', '00000000000000000FCG0002', '0000000000000000000F0349', '0053', 0, '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001');

-- 施設関連店舗
insert into health_facility_relate_pharmacy
  (id, health_facility_id, pharmacy_id, start_date, end_date, created_at, created_by, updated_at, updated_by)
values
  ('000000000000000000FP0001', '0000000000000000000F0001', '0000000000000000000P0005', '2000-01-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0003', '0000000000000000000F0003', '0000000000000000000P0001', '2020-12-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0004', '0000000000000000000F0004', '0000000000000000000P0001', '2020-12-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0005', '0000000000000000000F0005', '0000000000000000000P0001', '2000-01-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0006', '0000000000000000000F0006', '0000000000000000000P0001', '2000-01-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0007', '0000000000000000000F0007', '0000000000000000000P0005', '2000-01-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0008', '0000000000000000000F0008', '0000000000000000000P0001', '2000-01-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0010', '0000000000000000000F0010', '0000000000000000000P0001', '2000-01-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0011', '0000000000000000000F0011', '0000000000000000000P0001', '2020-12-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0013', '0000000000000000000F0013', '0000000000000000000P0005', '2000-01-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0014', '0000000000000000000F0014', '0000000000000000000P0001', '2000-01-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0015', '0000000000000000000F0015', '0000000000000000000P0005', '2000-01-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0016', '0000000000000000000F0016', '0000000000000000000P0001', '2000-01-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0017', '0000000000000000000F0017', '0000000000000000000P0001', '2020-12-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0018', '0000000000000000000F0018', '0000000000000000000P0001', '2000-01-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0019', '0000000000000000000F0019', '0000000000000000000P0005', '2000-01-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0020', '0000000000000000000F0020', '0000000000000000000P0001', '2000-01-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0021', '0000000000000000000F0021', '0000000000000000000P0001', '2020-12-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0022', '0000000000000000000F0022', '0000000000000000000P0001', '2000-01-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0023', '0000000000000000000F0023', '0000000000000000000P0001', '2000-01-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0024', '0000000000000000000F0024', '0000000000000000000P0001', '2000-01-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0025', '0000000000000000000F0025', '0000000000000000000P0005', '2000-01-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0026', '0000000000000000000F0026', '0000000000000000000P0001', '2000-01-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0027', '0000000000000000000F0027', '0000000000000000000P0005', '2020-11-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0028', '0000000000000000000F0028', '0000000000000000000P0001', '2000-01-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0029', '0000000000000000000F0029', '0000000000000000000P0004', '2000-01-01', '2019-02-28', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0030', '0000000000000000000F0029', '0000000000000000000P0005', '2019-03-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0031', '0000000000000000000F0030', '0000000000000000000P0001', '2000-01-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0032', '0000000000000000000F0031', '0000000000000000000P0005', '2000-01-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0033', '0000000000000000000F0032', '0000000000000000000P0001', '2000-01-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0035', '0000000000000000000F0034', '0000000000000000000P0001', '2000-01-01', '2021-08-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0036', '0000000000000000000F0034', '0000000000000000000P0005', '2021-09-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0037', '0000000000000000000F0035', '0000000000000000000P0005', '2000-01-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0038', '0000000000000000000F0036', '0000000000000000000P0001', '2020-12-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0039', '0000000000000000000F0037', '0000000000000000000P0005', '2000-01-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0040', '0000000000000000000F0038', '0000000000000000000P0001', '2020-11-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0041', '0000000000000000000F0039', '0000000000000000000P0005', '2000-01-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0042', '0000000000000000000F0040', '0000000000000000000P0001', '2020-11-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0043', '0000000000000000000F0041', '0000000000000000000P0001', '2000-01-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0044', '0000000000000000000F0042', '0000000000000000000P0001', '2000-01-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0046', '0000000000000000000F0044', '0000000000000000000P0001', '2000-01-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0048', '0000000000000000000F0046', '0000000000000000000P0001', '2000-01-01', '2018-05-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0049', '0000000000000000000F0046', '0000000000000000000P0005', '2018-06-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0050', '0000000000000000000F0047', '0000000000000000000P0001', '2020-11-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0051', '0000000000000000000F0048', '0000000000000000000P0001', '2000-01-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0052', '0000000000000000000F0049', '0000000000000000000P0003', '2000-01-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0053', '0000000000000000000F0050', '0000000000000000000P0003', '2000-01-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0054', '0000000000000000000F0051', '0000000000000000000P0001', '2000-01-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0055', '0000000000000000000F0052', '0000000000000000000P0004', '2000-01-01', '2018-03-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0056', '0000000000000000000F0052', '0000000000000000000P0005', '2018-04-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0057', '0000000000000000000F0053', '0000000000000000000P0005', '2020-11-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0058', '0000000000000000000F0054', '0000000000000000000P0005', '2020-08-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0059', '0000000000000000000F0055', '0000000000000000000P0001', '2000-01-01', '2018-05-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0060', '0000000000000000000F0055', '0000000000000000000P0003', '2018-06-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0061', '0000000000000000000F0056', '0000000000000000000P0003', '2000-01-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0062', '0000000000000000000F0057', '0000000000000000000P0001', '2000-01-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0063', '0000000000000000000F0058', '0000000000000000000P0003', '2000-01-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0064', '0000000000000000000F0059', '0000000000000000000P0003', '2000-01-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0066', '0000000000000000000F0061', '0000000000000000000P0003', '2000-01-01', '2020-05-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0067', '0000000000000000000F0061', '0000000000000000000P0007', '2020-06-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0068', '0000000000000000000F0062', '0000000000000000000P0001', '2020-11-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0069', '0000000000000000000F0063', '0000000000000000000P0005', '2000-01-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0070', '0000000000000000000F0064', '0000000000000000000P0003', '2000-01-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0071', '0000000000000000000F0065', '0000000000000000000P0003', '2000-01-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0072', '0000000000000000000F0066', '0000000000000000000P0005', '2000-01-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0073', '0000000000000000000F0067', '0000000000000000000P0005', '2020-11-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0074', '0000000000000000000F0068', '0000000000000000000P0005', '2000-01-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0075', '0000000000000000000F0069', '0000000000000000000P0005', '2000-01-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0076', '0000000000000000000F0070', '0000000000000000000P0003', '2000-01-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0077', '0000000000000000000F0071', '0000000000000000000P0003', '2000-01-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0078', '0000000000000000000F0072', '0000000000000000000P0001', '2000-01-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0079', '0000000000000000000F0073', '0000000000000000000P0003', '2000-01-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0080', '0000000000000000000F0074', '0000000000000000000P0003', '2000-01-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0081', '0000000000000000000F0075', '0000000000000000000P0005', '2000-01-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0082', '0000000000000000000F0076', '0000000000000000000P0003', '2018-05-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0083', '0000000000000000000F0077', '0000000000000000000P0005', '2018-06-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0084', '0000000000000000000F0078', '0000000000000000000P0003', '2018-05-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0085', '0000000000000000000F0079', '0000000000000000000P0003', '2018-06-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0086', '0000000000000000000F0080', '0000000000000000000P0003', '2018-07-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0087', '0000000000000000000F0081', '0000000000000000000P0001', '2018-06-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0088', '0000000000000000000F0082', '0000000000000000000P0003', '2018-07-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0089', '0000000000000000000F0083', '0000000000000000000P0003', '2018-08-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0090', '0000000000000000000F0084', '0000000000000000000P0003', '2018-09-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0091', '0000000000000000000F0085', '0000000000000000000P0003', '2018-09-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0092', '0000000000000000000F0086', '0000000000000000000P0003', '2018-08-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0093', '0000000000000000000F0087', '0000000000000000000P0003', '2018-09-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0094', '0000000000000000000F0088', '0000000000000000000P0005', '2018-11-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0095', '0000000000000000000F0089', '0000000000000000000P0005', '2018-11-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0096', '0000000000000000000F0090', '0000000000000000000P0001', '2018-10-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0097', '0000000000000000000F0091', '0000000000000000000P0003', '2018-10-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0098', '0000000000000000000F0092', '0000000000000000000P0003', '2018-11-01', '2020-07-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0099', '0000000000000000000F0092', '0000000000000000000P0007', '2020-08-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0100', '0000000000000000000F0093', '0000000000000000000P0003', '2018-11-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0101', '0000000000000000000F0094', '0000000000000000000P0003', '2018-12-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0102', '0000000000000000000F0095', '0000000000000000000P0003', '2018-12-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0103', '0000000000000000000F0096', '0000000000000000000P0005', '2018-11-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0104', '0000000000000000000F0097', '0000000000000000000P0003', '2018-12-01', '2020-06-30', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0105', '0000000000000000000F0097', '0000000000000000000P0007', '2020-07-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0106', '0000000000000000000F0098', '0000000000000000000P0003', '2019-02-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0107', '0000000000000000000F0099', '0000000000000000000P0003', '2019-03-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0108', '0000000000000000000F0100', '0000000000000000000P0005', '2019-04-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0109', '0000000000000000000F0101', '0000000000000000000P0001', '2019-06-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0110', '0000000000000000000F0102', '0000000000000000000P0001', '2020-11-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0111', '0000000000000000000F0103', '0000000000000000000P0001', '2020-12-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0112', '0000000000000000000F0104', '0000000000000000000P0005', '2019-07-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0113', '0000000000000000000F0105', '0000000000000000000P0005', '2019-08-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0114', '0000000000000000000F0106', '0000000000000000000P0003', '2019-08-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0115', '0000000000000000000F0107', '0000000000000000000P0001', '2019-09-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0116', '0000000000000000000F0108', '0000000000000000000P0001', '2019-10-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0117', '0000000000000000000F0109', '0000000000000000000P0003', '2019-11-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0118', '0000000000000000000F0110', '0000000000000000000P0003', '2019-10-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0119', '0000000000000000000F0111', '0000000000000000000P0003', '2019-12-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0120', '0000000000000000000F0112', '0000000000000000000P0003', '2019-11-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0121', '0000000000000000000F0113', '0000000000000000000P0003', '2019-11-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0122', '0000000000000000000F0114', '0000000000000000000P0005', '2020-12-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0123', '0000000000000000000F0115', '0000000000000000000P0001', '2019-11-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0124', '0000000000000000000F0116', '0000000000000000000P0003', '2020-02-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0125', '0000000000000000000F0117', '0000000000000000000P0003', '2020-02-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0126', '0000000000000000000F0118', '0000000000000000000P0005', '2020-12-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0127', '0000000000000000000F0119', '0000000000000000000P0005', '2020-02-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0128', '0000000000000000000F0120', '0000000000000000000P0005', '2000-01-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0129', '0000000000000000000F0121', '0000000000000000000P0006', '2020-02-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0130', '0000000000000000000F0122', '0000000000000000000P0006', '2020-04-01', '2020-05-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0131', '0000000000000000000F0122', '0000000000000000000P0007', '2020-06-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0132', '0000000000000000000F0123', '0000000000000000000P0003', '2020-03-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0133', '0000000000000000000F0124', '0000000000000000000P0006', '2020-03-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0134', '0000000000000000000F0125', '0000000000000000000P0006', '2020-04-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0135', '0000000000000000000F0126', '0000000000000000000P0005', '2020-02-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0136', '0000000000000000000F0127', '0000000000000000000P0006', '2020-04-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0138', '0000000000000000000F0129', '0000000000000000000P0001', '2020-04-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0139', '0000000000000000000F0130', '0000000000000000000P0011', '2020-04-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0140', '0000000000000000000F0131', '0000000000000000000P0003', '2020-05-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0141', '0000000000000000000F0132', '0000000000000000000P0011', '2020-04-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0142', '0000000000000000000F0133', '0000000000000000000P0011', '2020-04-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0143', '0000000000000000000F0134', '0000000000000000000P0011', '2020-04-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0144', '0000000000000000000F0135', '0000000000000000000P0011', '2020-04-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0145', '0000000000000000000F0136', '0000000000000000000P0011', '2000-01-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0146', '0000000000000000000F0137', '0000000000000000000P0011', '2000-01-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0147', '0000000000000000000F0138', '0000000000000000000P0011', '2000-01-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0148', '0000000000000000000F0139', '0000000000000000000P0007', '2020-06-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0149', '0000000000000000000F0140', '0000000000000000000P0007', '2020-06-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0150', '0000000000000000000F0141', '0000000000000000000P0007', '2020-06-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0151', '0000000000000000000F0142', '0000000000000000000P0007', '2020-06-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0152', '0000000000000000000F0143', '0000000000000000000P0007', '2020-06-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0153', '0000000000000000000F0144', '0000000000000000000P0007', '2020-06-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0154', '0000000000000000000F0145', '0000000000000000000P0007', '2020-06-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0155', '0000000000000000000F0146', '0000000000000000000P0007', '2020-06-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0156', '0000000000000000000F0147', '0000000000000000000P0007', '2020-06-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0157', '0000000000000000000F0148', '0000000000000000000P0007', '2020-06-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0158', '0000000000000000000F0149', '0000000000000000000P0007', '2020-06-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0159', '0000000000000000000F0150', '0000000000000000000P0007', '2020-06-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0160', '0000000000000000000F0151', '0000000000000000000P0007', '2020-06-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0161', '0000000000000000000F0152', '0000000000000000000P0007', '2020-06-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0162', '0000000000000000000F0153', '0000000000000000000P0007', '2020-06-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0163', '0000000000000000000F0154', '0000000000000000000P0007', '2020-06-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0164', '0000000000000000000F0155', '0000000000000000000P0007', '2020-06-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0165', '0000000000000000000F0156', '0000000000000000000P0005', '2020-06-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0166', '0000000000000000000F0157', '0000000000000000000P0003', '2020-05-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0167', '0000000000000000000F0158', '0000000000000000000P0003', '2020-07-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0168', '0000000000000000000F0159', '0000000000000000000P0001', '2020-11-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0169', '0000000000000000000F0160', '0000000000000000000P0006', '2000-01-01', '2020-05-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0170', '0000000000000000000F0160', '0000000000000000000P0007', '2020-06-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0171', '0000000000000000000F0161', '0000000000000000000P0011', '2020-07-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0172', '0000000000000000000F0162', '0000000000000000000P0011', '2020-07-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0173', '0000000000000000000F0163', '0000000000000000000P0005', '2020-07-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0174', '0000000000000000000F0164', '0000000000000000000P0006', '2020-08-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0175', '0000000000000000000F0165', '0000000000000000000P0003', '2020-11-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0176', '0000000000000000000F0166', '0000000000000000000P0006', '2020-11-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0177', '0000000000000000000F0167', '0000000000000000000P0009', '2000-01-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0178', '0000000000000000000F0168', '0000000000000000000P0009', '2000-01-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0179', '0000000000000000000F0169', '0000000000000000000P0009', '2000-01-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0180', '0000000000000000000F0170', '0000000000000000000P0009', '2000-01-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0181', '0000000000000000000F0171', '0000000000000000000P0009', '2000-01-01', '2023-01-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0182', '0000000000000000000F0171', '0000000000000000000P0011', '2023-02-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0183', '0000000000000000000F0172', '0000000000000000000P0009', '2000-01-01', '2023-01-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0184', '0000000000000000000F0172', '0000000000000000000P0011', '2023-02-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0185', '0000000000000000000F0173', '0000000000000000000P0009', '2000-01-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0186', '0000000000000000000F0174', '0000000000000000000P0009', '2000-01-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0187', '0000000000000000000F0175', '0000000000000000000P0009', '2000-01-01', '2022-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0188', '0000000000000000000F0175', '0000000000000000000P0011', '2023-01-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0189', '0000000000000000000F0176', '0000000000000000000P0009', '2000-01-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0190', '0000000000000000000F0177', '0000000000000000000P0009', '2000-01-01', '2022-10-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0191', '0000000000000000000F0177', '0000000000000000000P0011', '2022-11-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0192', '0000000000000000000F0178', '0000000000000000000P0009', '2000-01-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0193', '0000000000000000000F0179', '0000000000000000000P0009', '2000-01-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0194', '0000000000000000000F0180', '0000000000000000000P0009', '2000-01-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0195', '0000000000000000000F0181', '0000000000000000000P0009', '2000-01-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0196', '0000000000000000000F0182', '0000000000000000000P0009', '2000-01-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0197', '0000000000000000000F0183', '0000000000000000000P0009', '2000-01-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0198', '0000000000000000000F0184', '0000000000000000000P0009', '2000-01-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0199', '0000000000000000000F0185', '0000000000000000000P0009', '2000-01-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0200', '0000000000000000000F0186', '0000000000000000000P0009', '2000-01-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0201', '0000000000000000000F0187', '0000000000000000000P0009', '2000-01-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0202', '0000000000000000000F0188', '0000000000000000000P0009', '2000-01-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0203', '0000000000000000000F0189', '0000000000000000000P0006', '2020-10-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0204', '0000000000000000000F0190', '0000000000000000000P0009', '2000-01-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0205', '0000000000000000000F0191', '0000000000000000000P0009', '2000-01-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0206', '0000000000000000000F0192', '0000000000000000000P0009', '2000-01-01', '2022-10-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0207', '0000000000000000000F0192', '0000000000000000000P0011', '2022-11-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0208', '0000000000000000000F0193', '0000000000000000000P0005', '2022-11-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0209', '0000000000000000000F0194', '0000000000000000000P0005', '2022-12-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0210', '0000000000000000000F0195', '0000000000000000000P0003', '2021-01-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0211', '0000000000000000000F0196', '0000000000000000000P0003', '2021-01-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0212', '0000000000000000000F0197', '0000000000000000000P0003', '2021-01-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0213', '0000000000000000000F0198', '0000000000000000000P0006', '2021-02-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0214', '0000000000000000000F0199', '0000000000000000000P0005', '2021-02-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0215', '0000000000000000000F0200', '0000000000000000000P0005', '2021-03-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0216', '0000000000000000000F0201', '0000000000000000000P0001', '2021-02-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0217', '0000000000000000000F0202', '0000000000000000000P0003', '2021-03-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0218', '0000000000000000000F0203', '0000000000000000000P0003', '2021-03-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0219', '0000000000000000000F0204', '0000000000000000000P0003', '2021-03-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0220', '0000000000000000000F0205', '0000000000000000000P0007', '2021-03-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0221', '0000000000000000000F0206', '0000000000000000000P0005', '2021-02-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0222', '0000000000000000000F0207', '0000000000000000000P0007', '2021-03-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0223', '0000000000000000000F0208', '0000000000000000000P0009', '2021-04-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0224', '0000000000000000000F0209', '0000000000000000000P0005', '2021-04-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0225', '0000000000000000000F0210', '0000000000000000000P0001', '2021-04-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0226', '0000000000000000000F0211', '0000000000000000000P0004', '2021-04-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0227', '0000000000000000000F0212', '0000000000000000000P0003', '2021-04-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0228', '0000000000000000000F0213', '0000000000000000000P0007', '2021-05-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0229', '0000000000000000000F0214', '0000000000000000000P0007', '2021-06-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0230', '0000000000000000000F0215', '0000000000000000000P0007', '2021-06-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0231', '0000000000000000000F0216', '0000000000000000000P0009', '2021-05-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0232', '0000000000000000000F0217', '0000000000000000000P0009', '2021-06-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0233', '0000000000000000000F0218', '0000000000000000000P0006', '2021-06-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0234', '0000000000000000000F0219', '0000000000000000000P0005', '2021-06-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0235', '0000000000000000000F0220', '0000000000000000000P0003', '2021-06-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0236', '0000000000000000000F0221', '0000000000000000000P0007', '2021-09-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0237', '0000000000000000000F0222', '0000000000000000000P0009', '2021-08-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0238', '0000000000000000000F0223', '0000000000000000000P0007', '2021-10-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0239', '0000000000000000000F0224', '0000000000000000000P0006', '2021-11-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0240', '0000000000000000000F0225', '0000000000000000000P0007', '2021-11-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0241', '0000000000000000000F0226', '0000000000000000000P0003', '2021-12-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0242', '0000000000000000000F0227', '0000000000000000000P0003', '2021-12-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0243', '0000000000000000000F0228', '0000000000000000000P0009', '2021-11-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0244', '0000000000000000000F0229', '0000000000000000000P0001', '2022-01-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0245', '0000000000000000000F0230', '0000000000000000000P0001', '2022-01-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0246', '0000000000000000000F0231', '0000000000000000000P0009', '2022-03-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0247', '0000000000000000000F0232', '0000000000000000000P0005', '2022-02-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0248', '0000000000000000000F0233', '0000000000000000000P0009', '2022-02-01', '2022-10-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0249', '0000000000000000000F0233', '0000000000000000000P0011', '2022-11-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0250', '0000000000000000000F0234', '0000000000000000000P0008', '2022-03-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0251', '0000000000000000000F0235', '0000000000000000000P0008', '2022-03-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0252', '0000000000000000000F0236', '0000000000000000000P0007', '2022-03-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0253', '0000000000000000000F0237', '0000000000000000000P0007', '2022-04-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0254', '0000000000000000000F0238', '0000000000000000000P0006', '2022-04-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0255', '0000000000000000000F0239', '0000000000000000000P0009', '2022-03-01', '2023-01-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0256', '0000000000000000000F0239', '0000000000000000000P0011', '2022-02-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0257', '0000000000000000000F0240', '0000000000000000000P0009', '2022-04-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0258', '0000000000000000000F0241', '0000000000000000000P0009', '2022-04-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0259', '0000000000000000000F0242', '0000000000000000000P0009', '2022-05-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0260', '0000000000000000000F0243', '0000000000000000000P0001', '2022-04-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0261', '0000000000000000000F0244', '0000000000000000000P0005', '2022-04-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0262', '0000000000000000000F0245', '0000000000000000000P0008', '2022-04-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0263', '0000000000000000000F0246', '0000000000000000000P0009', '2022-06-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0264', '0000000000000000000F0247', '0000000000000000000P0009', '2022-06-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0265', '0000000000000000000F0248', '0000000000000000000P0009', '2022-06-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0266', '0000000000000000000F0249', '0000000000000000000P0003', '2022-05-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0267', '0000000000000000000F0250', '0000000000000000000P0007', '2022-07-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0268', '0000000000000000000F0251', '0000000000000000000P0003', '2022-06-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0269', '0000000000000000000F0252', '0000000000000000000P0009', '2022-07-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0270', '0000000000000000000F0253', '0000000000000000000P0009', '2022-07-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0271', '0000000000000000000F0254', '0000000000000000000P0009', '2022-07-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0272', '0000000000000000000F0255', '0000000000000000000P0004', '2022-07-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0273', '0000000000000000000F0256', '0000000000000000000P0009', '2022-08-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0274', '0000000000000000000F0257', '0000000000000000000P0009', '2022-08-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0275', '0000000000000000000F0258', '0000000000000000000P0009', '2022-08-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0276', '0000000000000000000F0259', '0000000000000000000P0009', '2022-08-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0277', '0000000000000000000F0260', '0000000000000000000P0009', '2022-08-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0278', '0000000000000000000F0261', '0000000000000000000P0006', '2022-08-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0279', '0000000000000000000F0262', '0000000000000000000P0005', '2022-07-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0280', '0000000000000000000F0263', '0000000000000000000P0008', '2022-08-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0281', '0000000000000000000F0264', '0000000000000000000P0008', '2022-08-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0282', '0000000000000000000F0265', '0000000000000000000P0007', '2022-08-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0283', '0000000000000000000F0266', '0000000000000000000P0007', '2022-09-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0284', '0000000000000000000F0267', '0000000000000000000P0005', '2022-09-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0285', '0000000000000000000F0268', '0000000000000000000P0006', '2022-10-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0286', '0000000000000000000F0269', '0000000000000000000P0009', '2022-10-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0287', '0000000000000000000F0270', '0000000000000000000P0008', '2022-11-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0288', '0000000000000000000F0271', '0000000000000000000P0007', '2022-12-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0289', '0000000000000000000F0272', '0000000000000000000P0005', '2022-12-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0290', '0000000000000000000F0273', '0000000000000000000P0005', '2023-02-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0291', '0000000000000000000F0274', '0000000000000000000P0005', '2023-03-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0292', '0000000000000000000F0275', '0000000000000000000P0005', '2023-03-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0293', '0000000000000000000F0276', '0000000000000000000P0001', '2023-03-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0294', '0000000000000000000F0277', '0000000000000000000P0009', '2023-03-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0295', '0000000000000000000F0278', '0000000000000000000P0007', '2023-04-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0296', '0000000000000000000F0279', '0000000000000000000P0007', '2023-04-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0297', '0000000000000000000F0280', '0000000000000000000P0015', '2023-03-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0298', '0000000000000000000F0281', '0000000000000000000P0001', '2023-04-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0299', '0000000000000000000F0282', '0000000000000000000P0009', '2023-05-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0300', '0000000000000000000F0283', '0000000000000000000P0008', '2023-06-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0301', '0000000000000000000F0284', '0000000000000000000P0014', '2023-07-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0302', '0000000000000000000F0285', '0000000000000000000P0014', '2023-07-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0303', '0000000000000000000F0286', '0000000000000000000P0014', '2023-07-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0304', '0000000000000000000F0287', '0000000000000000000P0014', '2023-08-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0305', '0000000000000000000F0288', '0000000000000000000P0014', '2023-08-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0306', '0000000000000000000F0289', '0000000000000000000P0014', '2023-08-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0307', '0000000000000000000F0290', '0000000000000000000P0014', '2023-08-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0308', '0000000000000000000F0291', '0000000000000000000P0008', '2023-07-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0309', '0000000000000000000F0292', '0000000000000000000P0003', '2023-07-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0310', '0000000000000000000F0293', '0000000000000000000P0009', '2023-09-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0311', '0000000000000000000F0294', '0000000000000000000P0009', '2023-09-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0312', '0000000000000000000F0295', '0000000000000000000P0008', '2023-10-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0313', '0000000000000000000F0296', '0000000000000000000P0007', '2023-09-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0314', '0000000000000000000F0297', '0000000000000000000P0012', '2000-01-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0315', '0000000000000000000F0298', '0000000000000000000P0012', '2000-01-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0316', '0000000000000000000F0299', '0000000000000000000P0012', '2000-01-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0317', '0000000000000000000F0300', '0000000000000000000P0012', '2000-01-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0318', '0000000000000000000F0301', '0000000000000000000P0012', '2000-01-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0319', '0000000000000000000F0302', '0000000000000000000P0012', '2000-01-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0320', '0000000000000000000F0303', '0000000000000000000P0012', '2000-01-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0321', '0000000000000000000F0304', '0000000000000000000P0012', '2000-01-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0322', '0000000000000000000F0305', '0000000000000000000P0012', '2000-01-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0323', '0000000000000000000F0306', '0000000000000000000P0012', '2000-01-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0324', '0000000000000000000F0307', '0000000000000000000P0012', '2000-01-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0325', '0000000000000000000F0308', '0000000000000000000P0012', '2000-01-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0326', '0000000000000000000F0309', '0000000000000000000P0012', '2000-01-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0327', '0000000000000000000F0310', '0000000000000000000P0012', '2000-01-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0328', '0000000000000000000F0311', '0000000000000000000P0013', '2023-07-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0329', '0000000000000000000F0312', '0000000000000000000P0012', '2000-01-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0330', '0000000000000000000F0313', '0000000000000000000P0012', '2000-01-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0331', '0000000000000000000F0314', '0000000000000000000P0012', '2000-01-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0332', '0000000000000000000F0315', '0000000000000000000P0012', '2000-01-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0333', '0000000000000000000F0316', '0000000000000000000P0012', '2000-01-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0334', '0000000000000000000F0317', '0000000000000000000P0012', '2000-01-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0335', '0000000000000000000F0318', '0000000000000000000P0012', '2000-01-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0336', '0000000000000000000F0319', '0000000000000000000P0012', '2000-01-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0337', '0000000000000000000F0320', '0000000000000000000P0012', '2000-01-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0338', '0000000000000000000F0321', '0000000000000000000P0012', '2000-01-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0339', '0000000000000000000F0322', '0000000000000000000P0012', '2000-01-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0340', '0000000000000000000F0323', '0000000000000000000P0012', '2000-01-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0341', '0000000000000000000F0324', '0000000000000000000P0013', '2023-07-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0342', '0000000000000000000F0325', '0000000000000000000P0012', '2000-01-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0343', '0000000000000000000F0326', '0000000000000000000P0012', '2000-01-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0344', '0000000000000000000F0327', '0000000000000000000P0012', '2000-01-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0345', '0000000000000000000F0328', '0000000000000000000P0012', '2000-01-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0346', '0000000000000000000F0329', '0000000000000000000P0012', '2000-01-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0347', '0000000000000000000F0330', '0000000000000000000P0012', '2000-01-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0348', '0000000000000000000F0331', '0000000000000000000P0012', '2000-01-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0349', '0000000000000000000F0332', '0000000000000000000P0012', '2000-01-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0350', '0000000000000000000F0333', '0000000000000000000P0012', '2000-01-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0351', '0000000000000000000F0334', '0000000000000000000P0012', '2000-01-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0352', '0000000000000000000F0335', '0000000000000000000P0013', '2000-01-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0353', '0000000000000000000F0336', '0000000000000000000P0012', '2000-01-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0354', '0000000000000000000F0337', '0000000000000000000P0013', '2000-01-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0355', '0000000000000000000F0338', '0000000000000000000P0012', '2000-01-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0356', '0000000000000000000F0339', '0000000000000000000P0012', '2000-01-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0357', '0000000000000000000F0340', '0000000000000000000P0013', '2000-01-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0358', '0000000000000000000F0341', '0000000000000000000P0013', '2000-01-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0359', '0000000000000000000F0342', '0000000000000000000P0012', '2000-01-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0360', '0000000000000000000F0343', '0000000000000000000P0013', '2000-01-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0361', '0000000000000000000F0344', '0000000000000000000P0013', '2023-04-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0362', '0000000000000000000F0345', '0000000000000000000P0012', '2023-04-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0363', '0000000000000000000F0346', '0000000000000000000P0013', '2023-04-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0364', '0000000000000000000F0347', '0000000000000000000P0012', '2022-09-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0365', '0000000000000000000F0348', '0000000000000000000P0013', '2023-04-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001'),
  ('000000000000000000FP0366', '0000000000000000000F0349', '0000000000000000000P0012', '2023-04-01', '2100-12-31', '2023-10-01 00:00:00', '0000000000000000000U0001', '2023-10-01 00:00:00', '0000000000000000000U0001');
