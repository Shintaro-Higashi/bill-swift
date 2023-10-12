/*
 * 会社テーブルから金融機関情報を削除
 */
ALTER TABLE company DROP financial_code;
ALTER TABLE company DROP financial_name;
ALTER TABLE company DROP branch_code;
ALTER TABLE company DROP branch_name;
ALTER TABLE company DROP account_type;
ALTER TABLE company DROP account_no;
ALTER TABLE company DROP account_name;

/*
 * 口座管理テーブルを新規作成
 */
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
ALTER TABLE account_manage
  ADD CONSTRAINT account_manage_FK1 FOREIGN KEY (created_by) REFERENCES user(id);
ALTER TABLE account_manage
  ADD CONSTRAINT account_manage_FK2 FOREIGN KEY (updated_by) REFERENCES user(id);

/*
 * 店舗テーブルに口座管理IDを追加
 */
SET foreign_key_checks = 0;
ALTER TABLE pharmacy
  ADD withdrawal_account_manage_id VARCHAR(64) NOT NULL
  COMMENT '振替口座管理ID' AFTER fax;
ALTER TABLE pharmacy
  ADD transfer_account_manage_id VARCHAR(64) NOT NULL
  COMMENT '振替口座管理ID' AFTER withdrawal_account_manage_id;
ALTER TABLE pharmacy
  ADD CONSTRAINT pharmacy_FK5 FOREIGN KEY (transfer_account_manage_id) REFERENCES account_manage(id);
ALTER TABLE pharmacy
  ADD CONSTRAINT pharmacy_FK6 FOREIGN KEY (withdrawal_account_manage_id) REFERENCES account_manage(id);
SET foreign_key_checks = 1;

/*
 * 施設テーブルにカラムを追加
 */
ALTER TABLE health_facility
  ADD billing_type enum('BATCH', 'INDIVISUAL', 'OTHER')
  COMMENT '請求種別:BATCH: 一括請求, INDIVISUAL: 個人請求, OTHER: その他' AFTER url;
ALTER TABLE health_facility
  ADD payment_type enum('CASH', 'WITHDRAWAL', 'TRANSFER', 'OTHER')
  COMMENT '支払い種別:CASH: 現金, WITHDRAWAL: 振替, TRANSFER: 振込, OTHER: その他' AFTER billing_type;
ALTER TABLE health_facility
  ADD transfer_guide enum('MIZUHO', 'RISONA', 'JA', 'OTHER')
  COMMENT '振込案内:MIZUHO: みずほ, RISONA: りそな, JA: JA, OTHER: その他' AFTER payment_type;

/*
 * 患者テーブルの変更
 */
-- 医療証
ALTER TABLE patient DROP medical_confirm_date;
ALTER TABLE patient
  ADD medical_insurance_status enum('UNCONFIRMED', 'CONFIRMED', 'UPDATING') DEFAULT 'UNCONFIRMED' NOT NULL
  COMMENT '医療保険ステータス:UNCONFIRMED: 未確認, CONFIRMED: 確認済, UPDATING: 更新中' AFTER birthday;
ALTER TABLE patient
  ADD medical_insurance_start_date DATE
  COMMENT '医療保険開始日' AFTER medical_insurance_status;
ALTER TABLE patient
  ADD medical_insurance_end_date DATE
  COMMENT '医療保険終了日' AFTER medical_insurance_start_date;

-- 介護証
ALTER TABLE patient DROP nursing_confirm_date;
ALTER TABLE patient
  ADD nursing_insurance_status enum('UNCONFIRMED', 'CONFIRMED', 'UPDATING') DEFAULT 'UNCONFIRMED' NOT NULL
  COMMENT '介護保険ステータス:UNCONFIRMED: 未確認, CONFIRMED: 確認済, UPDATING: 更新中'
  AFTER medical_insurance_end_date;
ALTER TABLE patient
  ADD nursing_insurance_start_date DATE
  COMMENT '介護保険開始日'
  AFTER nursing_insurance_status;
ALTER TABLE patient
  ADD nursing_insurance_end_date DATE
  COMMENT '介護保険終了日'
  AFTER nursing_insurance_start_date;

-- 負担者割合
ALTER TABLE patient
  MODIFY share_confirm_date DATE
  COMMENT '負担割合証確認日'
  AFTER nursing_insurance_end_date;

-- 公費
ALTER TABLE patient
  ADD public_expense BOOL DEFAULT false NOT NULL
  COMMENT '公費フラグ:true: 有, false: 無'
  AFTER share_confirm_date;

-- 同意書
ALTER TABLE patient
  ADD consent_status enum('UNSIGNED', 'UNCOLLECTED', 'COLLECTED', 'OTHER') DEFAULT 'UNSIGNED' NOT NULL
  COMMENT '同意書ステータス:UNSIGNED: 未契約, UNCOLLECTED: 未回収, COLLECTED: 回収済, OTHER: その他'
  AFTER share_confirm_date;
ALTER TABLE patient
  MODIFY consent_confirm_date DATE
  COMMENT '同意書確認日:同意書ステータスが回収済みとなったら自動設定'
  AFTER consent_status;

-- 支払い種別・口座振替
ALTER TABLE patient DROP account_confirm_date;
ALTER TABLE patient DROP withdrawal_type;
ALTER TABLE patient
  MODIFY payment_type enum('UNDEFINED', 'CASH', 'WITHDRAWAL', 'WITHDRAWAL_STOP', 'WITHDRAWAL_CONTINUE', 'TRANSFER', 'CONVENIENCE', 'LATER')  DEFAULT 'UNDEFINED' NOT NULL
  COMMENT '支払い種別:UNDEFINED: 未確認, CASH: 現金, WITHDRAWAL: 振替, WITHDRAWAL_STOP: 振替変更（停止）, WITHDRAWAL_CONTINUE: 振替変更（継続）, TRANSFER: 振込, CONVENIENCE: コンビニ払い, LATER: 後払い'
  AFTER consent_confirm_date;
ALTER TABLE patient
  MODIFY account_confirm_status enum('UNCOLLECTED', 'AVAILABLE', 'INVALID')
  COMMENT '口座振替確認状態:口座振替の場合に初期値を未回収で設定。UNCOLLECTED: 未回収, AVAILABLE: 使用可, INVALID: 不備'
  AFTER payment_type;
ALTER TABLE patient
  ADD account_manage_id VARCHAR(64)
  COMMENT '振替口座管理ID:口座振替の場合に設定'
  AFTER account_confirm_status;

-- 請求先⇒送付先への変更
ALTER TABLE patient
  CHANGE billing_name delivery_name VARCHAR(64) COMMENT '送付先氏名';
ALTER TABLE patient
  CHANGE billing_postal_code delivery_postal_code CHAR(8) COMMENT '送付先郵便番号:ハイフン付き「NNN-NNNN」';
ALTER TABLE patient
  CHANGE billing_address1 delivery_address1 VARCHAR(128) COMMENT '送付先住所1';
ALTER TABLE patient
  CHANGE billing_address2 delivery_address2 VARCHAR(128) COMMENT '送付先住所2';
ALTER TABLE patient
  CHANGE billing_tel delivery_tel VARCHAR(16) COMMENT '送付先電話番号';

-- 施設情報の追加
ALTER TABLE patient
  ADD health_facility_info VARCHAR(255)
  COMMENT '施設情報:患者の施設移動が発生したら切り替えバッチでクリアする'
  AFTER delivery_tel;

/*
 * デフォルト終了日の変更
 */
ALTER TABLE patient_relate_health_facility
  MODIFY end_date DATE DEFAULT '2100-12-31' NOT NULL COMMENT '退居日';
ALTER TABLE health_facility_relate_pharmacy
  MODIFY end_date DATE DEFAULT '2100-12-31' NOT NULL COMMENT '終了日';
