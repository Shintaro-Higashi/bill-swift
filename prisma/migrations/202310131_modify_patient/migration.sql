-- 患者テーブルに施設IDを追加
ALTER TABLE patient
  ADD health_facility_id VARCHAR(64) NOT NULL COMMENT '施設ID:現在所属している施設ID' AFTER id;
ALTER TABLE patient
  ADD CONSTRAINT patient_FK3 FOREIGN KEY (health_facility_id) REFERENCES health_facility(id);

-- 直前のマイグレーションで患者コード履歴テーブルに施設IDを追加した際に NOT NULL をつけ忘れていたので修正
ALTER TABLE patient_code_history
  MODIFY health_facility_id VARCHAR(64) NOT NULL COMMENT '施設ID';

-- 直前の修正でER図にコメント書いたけど、DBには反映していなかったので念のため更新
ALTER TABLE pharmacy
  MODIFY company_id VARCHAR(64) NOT NULL COMMENT '会社ID:現在所属している会社ID';
