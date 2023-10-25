/* ----------------------------------------------------------------------------
 * テーブル作成
 * --------------------------------------------------------------------------*/

-- ユーザー
CREATE TABLE user (
  id VARCHAR(64) NOT NULL COMMENT 'ID'
  , user_type enum('ADMIN', 'STAFF', 'PHARMACY', 'PATIENT') NOT NULL COMMENT 'ユーザー種別:ADMIN: 管理者, STAFF: 業務課, PHARMACY: 店舗, PATIENT: 患者'
  , name VARCHAR(128) NOT NULL COMMENT '氏名'
  , user_id VARCHAR(128) NOT NULL COMMENT 'ユーザID:ログインする時のID'
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

CREATE UNIQUE INDEX user_id_unique_idx
  ON user(user_id,existence);


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


-- 口座管理
CREATE TABLE account_manage (
  id VARCHAR(64) NOT NULL COMMENT 'ID'
  , name VARCHAR(64) NOT NULL COMMENT '名称'
  , transfer_date SMALLINT COMMENT '振替日:日付（1-31）を設定'
  , financial_code CHAR(4) COMMENT '金融機関コード'
  , financial_name VARCHAR(64) COMMENT '金融機関名'
  , branch_code CHAR(3) COMMENT '支店コード'
  , branch_name VARCHAR(64) COMMENT '支店名称'
  , account_type enum('SAVINGS', 'CURRENT') COMMENT '口座種別:SAVINGS: 普通, CURRENT: 当座'
  , account_no VARCHAR(7) COMMENT '口座番号'
  , account_name VARCHAR(64) COMMENT '口座名'
  , created_at TIMESTAMP NULL DEFAULT NULL COMMENT '登録日時'
  , created_by VARCHAR(64) COMMENT '登録ユーザーID'
  , updated_at TIMESTAMP NULL DEFAULT NULL COMMENT '更新日時'
  , updated_by VARCHAR(64) COMMENT '更新ユーザーID'
  , deleted_at TIMESTAMP NULL DEFAULT NULL COMMENT '削除日時'
  , existence boolean as (CASE WHEN deleted_at IS NULL THEN 1 ELSE NULL END) COMMENT '削除有無:1:有効 NULL:論理削除'
  , CONSTRAINT account_manage_PKC PRIMARY KEY (id)
) COMMENT '口座管理' ;


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
  , company_id VARCHAR(64) NOT NULL COMMENT '会社ID:現在所属している会社ID'
  , pharmacy_group_id VARCHAR(64) NOT NULL COMMENT '薬局グループID'
  , name VARCHAR(64) NOT NULL COMMENT '名称:薬局グループと同じだったら表示に工夫が必要'
  , name_kana VARCHAR(128) NOT NULL COMMENT 'カナ名称'
  , medical_institution_code VARCHAR(16) COMMENT '医療機関コード:NSIPSのコード（発行されるまでタイムラグがあるのでNULL許可）'
  , postal_code CHAR(8) NOT NULL COMMENT '郵便番号:ハイフン付き「NNN-NNNN」'
  , address1 VARCHAR(128) NOT NULL COMMENT '住所1'
  , address2 VARCHAR(128) COMMENT '住所2'
  , tel VARCHAR(16) NOT NULL COMMENT '電話番号'
  , fax VARCHAR(16) COMMENT 'FAX番号'
  , withdrawal_account_manage_id VARCHAR(64) NOT NULL COMMENT '振替口座管理ID'
  , transfer_account_manage_id VARCHAR(64) NOT NULL COMMENT '振込口座管理ID'
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
  , end_date DATE DEFAULT '2100-01-01' NOT NULL COMMENT '終了日:1年毎の更新らしいので基本は1年後の設定になるはず'
  , created_at TIMESTAMP NULL DEFAULT NULL COMMENT '登録日時'
  , created_by VARCHAR(64) COMMENT '登録ユーザーID'
  , updated_at TIMESTAMP NULL DEFAULT NULL COMMENT '更新日時'
  , updated_by VARCHAR(64) COMMENT '更新ユーザーID'
  , deleted_at TIMESTAMP NULL DEFAULT NULL COMMENT '削除日時'
  , existence boolean as (CASE WHEN deleted_at IS NULL THEN 1 ELSE NULL END) COMMENT '削除有無:1:有効 NULL:論理削除'
  , CONSTRAINT pharmacy_base_compounding_setting_PKC PRIMARY KEY (id)
) COMMENT '薬局基本調剤設定:調剤基本料は薬局ごとに複数指定できるため、別テーブルで管理する' ;


-- 施設
CREATE TABLE health_facility (
  id VARCHAR(64) NOT NULL COMMENT 'ID'
  , pharmacy_id VARCHAR(64) NOT NULL COMMENT '薬局ID:現在所属している薬局IDを定義'
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
  , billing_type enum('BATCH', 'INDIVIDUAL', 'OTHER') COMMENT '請求種別:BATCH: 一括請求, INDIVIDUAL: 個人請求, OTHER: その他'
  , payment_type enum('CASH', 'WITHDRAWAL', 'TRANSFER', 'OTHER')  COMMENT '支払い種別:CASH: 現金, WITHDRAWAL: 引落（振替）, TRANSFER: 振込, OTHER: その他'
  , account_manage_id VARCHAR(64) COMMENT '振込用口座管理ID'
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


-- 施設関連薬局
CREATE TABLE health_facility_relate_pharmacy (
  id VARCHAR(64) NOT NULL COMMENT 'ID'
  , health_facility_id VARCHAR(64) NOT NULL COMMENT '施設ID'
  , pharmacy_id VARCHAR(64) NOT NULL COMMENT '薬局ID'
  , start_date DATE NOT NULL COMMENT '開始日'
  , end_date DATE DEFAULT '2100-12-31' NOT NULL COMMENT '終了日'
  , note TEXT COMMENT '備考'
  , created_at TIMESTAMP NULL DEFAULT NULL COMMENT '登録日時'
  , created_by VARCHAR(64) COMMENT '登録ユーザーID'
  , updated_at TIMESTAMP NULL DEFAULT NULL COMMENT '更新日時'
  , updated_by VARCHAR(64) COMMENT '更新ユーザーID'
  , deleted_at TIMESTAMP NULL DEFAULT NULL COMMENT '削除日時'
  , existence boolean as (CASE WHEN deleted_at IS NULL THEN 1 ELSE NULL END) COMMENT '削除有無:1:有効 NULL:論理削除'
  , CONSTRAINT health_facility_relate_pharmacy_PKC PRIMARY KEY (id)
) COMMENT '施設関連薬局:薬局が取引する施設を管理' ;


-- 患者
CREATE TABLE patient (
  id VARCHAR(64) NOT NULL COMMENT 'ID'
  , health_facility_id VARCHAR(64) NOT NULL COMMENT '施設ID:現在所属している施設ID'
  , code CHAR(8) NOT NULL COMMENT '患者コード:現在有効な患者コード（施設の移動により切り替わる）'
  , status enum('INRESIDENCE','DECEASE','EXIT','RELOCATION') DEFAULT 'INRESIDENCE' NOT NULL COMMENT 'ステータス:INRESIDENCE:入居中、DECEASE:逝去、EXIT:退去'
  , name VARCHAR(64) NOT NULL COMMENT '氏名'
  , name_kana VARCHAR(128) NOT NULL COMMENT 'カナ氏名'
  , search_name VARCHAR(255) NOT NULL COMMENT '検索用氏名:スペースを取り除いた氏名とカナ指名を連結して格納'
  , gender enum('UNCERTAIN', 'MALE', 'FEMALE') DEFAULT 'UNCERTAIN' NOT NULL COMMENT '性別 :UNCERTAIN: 不明, MALE: 男, FEMALE: 女'
  , birthday DATE COMMENT '生年月日'
  , bill_enable_flag BOOL DEFAULT false NOT NULL COMMENT '請求可否フラグ:チェックリスト項目がすべてそろった場合にtrueに変更する'
  , medical_insurance_status enum('UNCONFIRMED', 'CONFIRMED', 'UPDATING') DEFAULT 'UNCONFIRMED' NOT NULL COMMENT '医療保険ステータス:UNCONFIRMED: 未確認, CONFIRMED: 確認済, UPDATING: 更新中'
  , medical_insurance_start_date DATE COMMENT '医療保険開始日'
  , medical_insurance_end_date DATE COMMENT '医療保険終了日'
  , medical_share_confirm_date DATE COMMENT '医療負担割合証確認日:未設定は未確認'
  , medical_share enum('ONE', 'TWO', 'THREE', 'NONE') COMMENT '医療負担割合:ONE: 1割, TWO: 2割, THREE: 3割, NONE: 負担なし'
  , nursing_insurance_status enum('UNCONFIRMED', 'CONFIRMED', 'UPDATING') DEFAULT 'UNCONFIRMED' NOT NULL COMMENT '介護保険ステータス:UNCONFIRMED: 未確認, CONFIRMED: 確認済, UPDATING: 更新中'
  , nursing_insurance_start_date DATE COMMENT '介護保険開始日'
  , nursing_insurance_end_date DATE COMMENT '介護保険終了日'
  , nursing_share_confirm_date DATE COMMENT '介護負担割合証確認日:未設定は未確認'
  , nursing_share enum('ONE', 'TWO', 'THREE', 'NONE') COMMENT '介護負担割合:ONE: 1割, TWO: 2割, THREE: 3割, NONE: 負担なし'
  , public_expense BOOL COMMENT '公費フラグ:true: 有, false: 無, null: 未確認'
  , consent_status enum('UNSIGNED', 'UNCOLLECTED', 'COLLECTED', 'OTHER') DEFAULT 'UNSIGNED' NOT NULL COMMENT '同意書ステータス:UNSIGNED: 未契約, UNCOLLECTED: 未回収, COLLECTED: 回収済, OTHER: その他'
  , consent_confirm_date DATE COMMENT '同意書確認日:同意書ステータスが回収済みとなったら自動設定'
  , payment_type enum('UNDEFINED', 'CASH', 'WITHDRAWAL', 'WITHDRAWAL_STOP', 'WITHDRAWAL_CONTINUE', 'TRANSFER', 'CONVENIENCE', 'LATER')  DEFAULT 'UNDEFINED' NOT NULL COMMENT '支払い種別:UNDEFINED: 未確認, CASH: 現金, WITHDRAWAL: 振替, WITHDRAWAL_STOP: 振替変更（停止）, WITHDRAWAL_CONTINUE: 振替変更（継続）, TRANSFER: 振込, CONVENIENCE: コンビニ払い, LATER: 後払い'
  , account_confirm_status enum('UNCOLLECTED', 'AVAILABLE', 'INVALID') COMMENT '口座振替確認状態:口座振替の場合に初期値を未回収で設定。UNCOLLECTED: 未回収, AVAILABLE: 使用可, INVALID: 不備'
  , account_manage_id VARCHAR(64) COMMENT '振替口座管理ID:口座振替の場合に設定'
  , receipt_sync_flag BOOL DEFAULT false NOT NULL COMMENT 'レセコン同期フラグ:請求CSVで一致を確認出来たらtrueに変更。転居などで店舗が変わるタイミングでfalseにリセットする必要がある'
  , delivery_name VARCHAR(64) COMMENT '送付先氏名'
  , delivery_postal_code CHAR(8) COMMENT '送付先郵便番号:ハイフン付き「NNN-NNNN」'
  , delivery_address1 VARCHAR(128) COMMENT '送付先住所1'
  , delivery_address2 VARCHAR(128) COMMENT '送付先住所2'
  , delivery_tel VARCHAR(16) COMMENT '送付先電話番号'
  , health_facility_info VARCHAR(255) COMMENT '施設情報:患者の施設移動が発生したら切り替えバッチでクリアする'
  , note TEXT COMMENT '備考'
  , created_at TIMESTAMP NULL DEFAULT NULL COMMENT '登録日時'
  , created_by VARCHAR(64) COMMENT '登録ユーザーID'
  , updated_at TIMESTAMP NULL DEFAULT NULL COMMENT '更新日時'
  , updated_by VARCHAR(64) COMMENT '更新ユーザーID'
  , deleted_at TIMESTAMP NULL DEFAULT NULL COMMENT '削除日時'
  , existence boolean as (CASE WHEN deleted_at IS NULL THEN 1 ELSE NULL END) COMMENT '削除有無:1:有効 NULL:論理削除'
  , CONSTRAINT patient_PKC PRIMARY KEY (id)
) COMMENT '患者:患者の基本情報を管理' ;


-- 患者関連施設
CREATE TABLE patient_relate_health_facility (
  id VARCHAR(64) NOT NULL COMMENT 'ID'
  , patient_id VARCHAR(64) NOT NULL COMMENT '患者ID'
  , health_facility_id VARCHAR(64) NOT NULL COMMENT '施設ID'
  , start_date DATE NOT NULL COMMENT '入居日'
  , end_date DATE DEFAULT '2100-12-31' NOT NULL COMMENT '退居日'
  , bill_sort INT COMMENT '請求書ソート順:施設単位での請求書に出力する患者のソート順。施設の患者ソート種別がその他以外はデータ登録時に番号を振りなおして更新する'
  , reason enum('DECEASE', 'EXIT','RELOCATION') COMMENT '退居理由:DECEASE: 逝去,EXIT:退去, RELOCATION: 転居'
  , note TEXT COMMENT '備考'
  , created_at TIMESTAMP NULL DEFAULT NULL COMMENT '登録日時'
  , created_by VARCHAR(64) COMMENT '登録ユーザーID'
  , updated_at TIMESTAMP NULL DEFAULT NULL COMMENT '更新日時'
  , updated_by VARCHAR(64) COMMENT '更新ユーザーID'
  , deleted_at TIMESTAMP NULL DEFAULT NULL COMMENT '削除日時'
  , existence boolean as (CASE WHEN deleted_at IS NULL THEN 1 ELSE NULL END) COMMENT '削除有無:1:有効 NULL:論理削除'
  , CONSTRAINT patient_relate_health_facility_PKC PRIMARY KEY (id)
) COMMENT '患者関連施設:施設が入居する患者を管理' ;


-- 患者コード履歴
CREATE TABLE patient_code_history (
  id VARCHAR(64) NOT NULL COMMENT 'ID'
  , patient_id VARCHAR(64) NOT NULL COMMENT '患者ID'
  , health_facility_id VARCHAR(64) NOT NULL COMMENT '施設ID'
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
  , attach_file_path VARCHAR(255) NOT NULL COMMENT '添付ファイルパス'
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
  , change_type enum('MANUAL','RECEIPT_SYNC') NOT NULL COMMENT '変更方法:MANUAL:手動操作,RECEIPT_SYNC:レセコン同期'
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
  , item_key VARCHAR(32) NOT NULL COMMENT '項目キー:項目物理名'
  , child_item_name VARCHAR(255) COMMENT '子項目名:配列の差分時に１要素に対する動的な項目名を設定'
  , before_value TEXT COMMENT '変更前の値'
  , after_value TEXT COMMENT '変更後の値'
  , created_at TIMESTAMP NULL DEFAULT NULL COMMENT '登録日時'
  , created_by VARCHAR(64) COMMENT '登録ユーザーID'
  , updated_at TIMESTAMP NULL DEFAULT NULL COMMENT '更新日時'
  , updated_by VARCHAR(64) COMMENT '更新ユーザーID'
  , deleted_at TIMESTAMP NULL DEFAULT NULL COMMENT '削除日時'
  , existence boolean as (CASE WHEN deleted_at IS NULL THEN 1 ELSE NULL END) COMMENT '削除有無:1:有効 NULL:論理削除'
  , CONSTRAINT patient_change_content_PKC PRIMARY KEY (id)
) COMMENT '患者変更内容:患者情報で変更された内容を管理' ;


-- 問い合わせ
CREATE TABLE inquiry (
  id VARCHAR(64) NOT NULL COMMENT 'ID'
  , title VARCHAR(64) NOT NULL COMMENT 'タイトル'
  , content TEXT NOT NULL COMMENT '問い合わせ内容'
  , status enum('OPEN', 'OPERATION', 'REJECT', 'CLOSE') DEFAULT 'OPEN' NOT NULL COMMENT 'ステータス:OPEN: 起票, OPERATION: 対応中, REJECT: 却下, CLOSE: 終了'
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

-- ユーザー
ALTER TABLE user
    ADD CONSTRAINT user_FK_created_by FOREIGN KEY (created_by) REFERENCES user(id);
ALTER TABLE user
    ADD CONSTRAINT user_FK_updated_by FOREIGN KEY (updated_by) REFERENCES user(id);

-- 施設コードグループ
ALTER TABLE health_facility_code_group
  ADD CONSTRAINT health_facility_code_group_FK_created_by FOREIGN KEY (created_by) REFERENCES user(id);
ALTER TABLE health_facility_code_group
  ADD CONSTRAINT health_facility_code_group_FK_updated_by FOREIGN KEY (updated_by) REFERENCES user(id);

-- 口座管理
ALTER TABLE account_manage
  ADD CONSTRAINT account_manage_FK_created_by FOREIGN KEY (created_by) REFERENCES user(id);
ALTER TABLE account_manage
  ADD CONSTRAINT account_manage_FK_updated_by FOREIGN KEY (updated_by) REFERENCES user(id);

-- 会社
ALTER TABLE company
  ADD CONSTRAINT company_FK1 FOREIGN KEY (health_facility_code_group_id) REFERENCES health_facility_code_group(id);
ALTER TABLE company
  ADD CONSTRAINT company_FK_created_by FOREIGN KEY (created_by) REFERENCES user(id);
ALTER TABLE company
  ADD CONSTRAINT company_FK_updated_by FOREIGN KEY (updated_by) REFERENCES user(id);

-- 薬局グループ
ALTER TABLE pharmacy_group
  ADD CONSTRAINT pharmacy_group_FK_created_by FOREIGN KEY (created_by) REFERENCES user(id);
ALTER TABLE pharmacy_group
  ADD CONSTRAINT pharmacy_group_FK_updated_by FOREIGN KEY (updated_by) REFERENCES user(id);

-- 薬局
ALTER TABLE pharmacy
  ADD CONSTRAINT pharmacy_FK1 FOREIGN KEY (transfer_account_manage_id) REFERENCES account_manage(id);
ALTER TABLE pharmacy
  ADD CONSTRAINT pharmacy_FK2 FOREIGN KEY (withdrawal_account_manage_id) REFERENCES account_manage(id);
ALTER TABLE pharmacy
  ADD CONSTRAINT pharmacy_FK3 FOREIGN KEY (pharmacy_group_id) REFERENCES pharmacy_group(id);
ALTER TABLE pharmacy
  ADD CONSTRAINT pharmacy_FK4 FOREIGN KEY (company_id) REFERENCES company(id);
ALTER TABLE pharmacy
  ADD CONSTRAINT pharmacy_FK_created_by FOREIGN KEY (created_by) REFERENCES user(id);
ALTER TABLE pharmacy
  ADD CONSTRAINT pharmacy_FK_updated_by FOREIGN KEY (updated_by) REFERENCES user(id);

-- 薬局基本調剤設定
ALTER TABLE pharmacy_base_compounding_setting
  ADD CONSTRAINT pharmacy_base_compounding_setting_FK1 FOREIGN KEY (pharmacy_id) REFERENCES pharmacy(id);
ALTER TABLE pharmacy_base_compounding_setting
  ADD CONSTRAINT pharmacy_base_compounding_setting_FK_created_by FOREIGN KEY (created_by) REFERENCES user(id);
ALTER TABLE pharmacy_base_compounding_setting
  ADD CONSTRAINT pharmacy_base_compounding_setting_FK_updated_by FOREIGN KEY (updated_by) REFERENCES user(id);

-- 施設関連薬局
ALTER TABLE health_facility_relate_pharmacy
  ADD CONSTRAINT health_facility_relate_pharmacy_FK1 FOREIGN KEY (health_facility_id) REFERENCES health_facility(id);
ALTER TABLE health_facility_relate_pharmacy
  ADD CONSTRAINT health_facility_relate_pharmacy_FK2 FOREIGN KEY (pharmacy_id) REFERENCES pharmacy(id);
ALTER TABLE health_facility_relate_pharmacy
  ADD CONSTRAINT health_facility_relate_pharmacy_FK_created_by FOREIGN KEY (created_by) REFERENCES user(id);
ALTER TABLE health_facility_relate_pharmacy
  ADD CONSTRAINT health_facility_relate_pharmacy_FK_updated_by FOREIGN KEY (updated_by) REFERENCES user(id);

-- 施設
ALTER TABLE health_facility
  ADD CONSTRAINT health_facility_FK1 FOREIGN KEY (pharmacy_id) REFERENCES pharmacy(id);
ALTER TABLE health_facility
  ADD CONSTRAINT health_facility_FK2 FOREIGN KEY (account_manage_id) REFERENCES account_manage(id);
ALTER TABLE health_facility
  ADD CONSTRAINT health_facility_FK_created_by FOREIGN KEY (created_by) REFERENCES user(id);
ALTER TABLE health_facility
  ADD CONSTRAINT health_facility_FK_updated_by FOREIGN KEY (updated_by) REFERENCES user(id);

-- 施設コード管理
ALTER TABLE health_facility_code_manage
  ADD CONSTRAINT health_facility_code_manage_FK1 FOREIGN KEY (health_facility_id) REFERENCES health_facility(id);
ALTER TABLE health_facility_code_manage
  ADD CONSTRAINT health_facility_code_manage_FK2 FOREIGN KEY (health_facility_code_group_id) REFERENCES health_facility_code_group(id);
ALTER TABLE health_facility_code_manage
  ADD CONSTRAINT health_facility_code_manage_FK_created_by FOREIGN KEY (created_by) REFERENCES user(id);
ALTER TABLE health_facility_code_manage
  ADD CONSTRAINT health_facility_code_manage_FK_updated_by FOREIGN KEY (updated_by) REFERENCES user(id);

-- 患者関連施設
ALTER TABLE patient_relate_health_facility
  ADD CONSTRAINT patient_relate_health_facility_FK1 FOREIGN KEY (health_facility_id) REFERENCES health_facility(id);
ALTER TABLE patient_relate_health_facility
  ADD CONSTRAINT patient_relate_health_facility_FK2 FOREIGN KEY (patient_id) REFERENCES patient(id);
ALTER TABLE patient_relate_health_facility
  ADD CONSTRAINT patient_relate_health_facility_FK_created_by FOREIGN KEY (created_by) REFERENCES user(id);
ALTER TABLE patient_relate_health_facility
  ADD CONSTRAINT patient_relate_health_facility_FK_updated_by FOREIGN KEY (updated_by) REFERENCES user(id);

-- 患者
ALTER TABLE patient
  ADD CONSTRAINT patient_FK1 FOREIGN KEY (health_facility_id) REFERENCES health_facility(id);
ALTER TABLE patient
  ADD CONSTRAINT patient_FK2 FOREIGN KEY (account_manage_id) REFERENCES account_manage(id);
ALTER TABLE patient
  ADD CONSTRAINT patient_FK_created_by FOREIGN KEY (created_by) REFERENCES user(id);
ALTER TABLE patient
  ADD CONSTRAINT patient_FK_updated_by FOREIGN KEY (updated_by) REFERENCES user(id);

-- 患者コード履歴
ALTER TABLE patient_code_history
  ADD CONSTRAINT patient_code_history_FK1 FOREIGN KEY (health_facility_id) REFERENCES health_facility(id);
ALTER TABLE patient_code_history
  ADD CONSTRAINT patient_code_history_FK2 FOREIGN KEY (patient_id) REFERENCES patient(id);
ALTER TABLE patient_code_history
  ADD CONSTRAINT patient_code_history_FK_created_by FOREIGN KEY (created_by) REFERENCES user(id);
ALTER TABLE patient_code_history
  ADD CONSTRAINT patient_code_history_FK_updated_by FOREIGN KEY (updated_by) REFERENCES user(id);

-- 患者ファイル
ALTER TABLE patient_file
  ADD CONSTRAINT patient_file_FK1 FOREIGN KEY (patient_id) REFERENCES patient(id);
ALTER TABLE patient_file
  ADD CONSTRAINT patient_file_FK_created_by FOREIGN KEY (created_by) REFERENCES user(id);
ALTER TABLE patient_file
  ADD CONSTRAINT patient_file_FK_updated_by FOREIGN KEY (updated_by) REFERENCES user(id);

-- 患者変更履歴
ALTER TABLE patient_change_history
  ADD CONSTRAINT patient_change_history_FK1 FOREIGN KEY (patient_id) REFERENCES patient(id);
ALTER TABLE patient_change_history
  ADD CONSTRAINT patient_change_history_FK_created_by FOREIGN KEY (created_by) REFERENCES user(id);
ALTER TABLE patient_change_history
  ADD CONSTRAINT patient_change_history_FK_updated_by FOREIGN KEY (updated_by) REFERENCES user(id);

-- 患者変更内容
ALTER TABLE patient_change_content
  ADD CONSTRAINT patient_change_content_FK1 FOREIGN KEY (patient_change_history_id) REFERENCES patient_change_history(id);
ALTER TABLE patient_change_content
  ADD CONSTRAINT patient_change_content_FK_created_by FOREIGN KEY (created_by) REFERENCES user(id);
ALTER TABLE patient_change_content
  ADD CONSTRAINT patient_change_content_FK_updated_by FOREIGN KEY (updated_by) REFERENCES user(id);

-- 問い合わせ
ALTER TABLE inquiry
  ADD CONSTRAINT inquiry_FK1 FOREIGN KEY (patient_id) REFERENCES patient(id);
ALTER TABLE inquiry
  ADD CONSTRAINT inquiry_FK_created_by FOREIGN KEY (created_by) REFERENCES user(id);
ALTER TABLE inquiry
  ADD CONSTRAINT inquiry_FK_updated_by FOREIGN KEY (updated_by) REFERENCES user(id);

-- 問い合わせ対応
ALTER TABLE inquiry_correspond
  ADD CONSTRAINT inquiry_correspond_FK1 FOREIGN KEY (inquiry_id) REFERENCES inquiry(id);
ALTER TABLE inquiry_correspond
  ADD CONSTRAINT inquiry_correspond_FK_created_by FOREIGN KEY (created_by) REFERENCES user(id);
ALTER TABLE inquiry_correspond
  ADD CONSTRAINT inquiry_correspond_FK_updated_by FOREIGN KEY (updated_by) REFERENCES user(id);

-- 問い合わせファイル
ALTER TABLE inquiry_file
  ADD CONSTRAINT inquiry_file_FK1 FOREIGN KEY (correspond_id) REFERENCES inquiry_correspond(id);
ALTER TABLE inquiry_file
  ADD CONSTRAINT inquiry_file_FK_created_by FOREIGN KEY (created_by) REFERENCES user(id);
ALTER TABLE inquiry_file
  ADD CONSTRAINT inquiry_file_FK_updated_by FOREIGN KEY (updated_by) REFERENCES user(id);


/* ----------------------------------------------------------------------------
 * 患者データ移行時に元データを保存しておくテーブル
 * --------------------------------------------------------------------------*/
CREATE TABLE caul_patient (
  code VARCHAR(64) NOT NULL COMMENT '得意先CD'
  , name VARCHAR(64) NOT NULL COMMENT '得意先名'
  , name_kana VARCHAR(64) COMMENT '得意先名カナ:請求CSVデータがあれば上書き'
  , gender VARCHAR(64) COMMENT '性別:請求CSVデータがあれば設定'
  , birthday DATE COMMENT '生年月日:請求CSVデータがあれば設定'
  , postal_code VARCHAR(64) COMMENT '郵便番号'
  , address1 VARCHAR(64) COMMENT '住所1'
  , address2 VARCHAR(64) COMMENT '住所2'
  , shop_cd VARCHAR(64) COMMENT '部門CD'
  , shop_name VARCHAR(64) COMMENT '部門名'
  , class_cd1 VARCHAR(64) COMMENT '分類CD1'
  , class_name1 VARCHAR(64) COMMENT '分類名1'
  , class_cd2 VARCHAR(64) COMMENT '分類CD2'
  , class_name2 VARCHAR(64) COMMENT '分類名2'
  , class_cd3 VARCHAR(64) COMMENT '分類CD3'
  , class_name3 VARCHAR(64) COMMENT '分類名3'
  , class_cd4 VARCHAR(64) COMMENT '分類CD4'
  , class_name4 VARCHAR(64) COMMENT '分類名4'
  , class_cd5 VARCHAR(64) COMMENT '分類CD5'
  , class_name5 VARCHAR(64) COMMENT '分類名5'
  , bill_type VARCHAR(64) COMMENT '請求書種類'
  , bill_type_name VARCHAR(64) COMMENT '請求書種類名'
  , last_bill_day DATE COMMENT '前回請求締年月日'
  , note TEXT COMMENT '備考'
  , facility_cd VARCHAR(64) COMMENT '施設CD'
  , facility_name VARCHAR(64) COMMENT '施設名'
  , deliverry_name VARCHAR(64) COMMENT '送付先宛名'
  , consent_cd VARCHAR(64) COMMENT '同意書CD'
  , consent_name VARCHAR(64) COMMENT '同意書名'
  , insurance_cd VARCHAR(64) COMMENT '保険書CD'
  , insurance_name VARCHAR(64) COMMENT '保険書名'
  , bill_issue_cd VARCHAR(64) COMMENT '請求書発行CD'
  , bill_issue_name VARCHAR(64) COMMENT '請求書発行名'
  , comment TEXT COMMENT '申し送り'
  , created_at DATE COMMENT '登録日時'
  , updated_at DATE COMMENT '更新日時'
  , file_name VARCHAR(255) COMMENT '元データファイル名'
  , CONSTRAINT caul_patient_PKC PRIMARY KEY (code)
) COMMENT 'カウル患者データ' ;
