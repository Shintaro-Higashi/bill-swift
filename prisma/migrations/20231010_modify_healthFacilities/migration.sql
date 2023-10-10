-- 施設テーブルに薬局IDを追加
ALTER TABLE health_facility
    ADD pharmacy_id VARCHAR(64) NOT NULL COMMENT '薬局ID:現在所属している薬局IDを定義' AFTER id;

-- 外部キー追加
SET foreign_key_checks = 0;
ALTER TABLE health_facility
    ADD CONSTRAINT health_facility_fk_pharmacy_id FOREIGN KEY (pharmacy_id) REFERENCES pharmacy(id);
SET foreign_key_checks = 1;