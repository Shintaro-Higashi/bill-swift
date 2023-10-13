-- 患者コード履歴テーブルに施設IDを追加
ALTER TABLE patient_code_history
  ADD health_facility_id VARCHAR(64) COMMENT '施設ID' AFTER patient_id;
ALTER TABLE patient_code_history
  ADD CONSTRAINT patient_code_history_FK4 FOREIGN KEY (health_facility_id) REFERENCES health_facility(id);

-- 薬局関連会社テーブルを追加
CREATE TABLE pharmacy_relate_company (
  id VARCHAR(64) NOT NULL COMMENT 'ID'
  , company_id VARCHAR(64) NOT NULL COMMENT '会社ID'
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
  , CONSTRAINT pharmacy_relate_company_PKC PRIMARY KEY (id)
) COMMENT '薬局関連会社:薬局と会社の関連を管理（所属する会社を切り替える可能性があるため）' ;

ALTER TABLE pharmacy_relate_company
  ADD CONSTRAINT pharmacy_relate_company_FK1 FOREIGN KEY (pharmacy_id) REFERENCES pharmacy(id);
ALTER TABLE pharmacy_relate_company
  ADD CONSTRAINT pharmacy_relate_company_FK2 FOREIGN KEY (company_id) REFERENCES company(id);
ALTER TABLE pharmacy_relate_company
  ADD CONSTRAINT pharmacy_relate_company_FK3 FOREIGN KEY (created_by) REFERENCES user(id);
ALTER TABLE pharmacy_relate_company
  ADD CONSTRAINT pharmacy_relate_company_FK4 FOREIGN KEY (updated_by) REFERENCES user(id);
