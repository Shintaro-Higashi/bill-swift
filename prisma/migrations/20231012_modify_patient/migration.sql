-- 患者テーブルの負担割合を医療と介護それぞれに用意して付加項目も追加
ALTER TABLE patient DROP share_confirm_date;
ALTER TABLE patient
  ADD medical_share_confirm_date DATE
  COMMENT '医療負担割合証確認日:未設定は未確認'
  AFTER medical_insurance_end_date;
ALTER TABLE patient
  ADD medical_share enum('ONE', 'TWO', 'THREE', 'NONE')
  COMMENT '医療負担割合:ONE: 1割, TWO: 2割, THREE: 3割, NONE: 負担なし'
  AFTER medical_share_confirm_date;

ALTER TABLE patient
  ADD nursing_share_confirm_date DATE
  COMMENT '介護負担割合証確認日:未設定は未確認'
  AFTER nursing_insurance_end_date;
ALTER TABLE patient
  ADD nursing_share enum('ONE', 'TWO', 'THREE', 'NONE')
  COMMENT '介護負担割合:ONE: 1割, TWO: 2割, THREE: 3割, NONE: 負担なし'
  AFTER nursing_share_confirm_date;
