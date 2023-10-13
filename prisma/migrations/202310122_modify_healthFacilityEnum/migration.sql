-- 施設の請求種別の enum の定義でスペルミスがあったため修正
ALTER TABLE health_facility
  MODIFY billing_type enum('BATCH', 'INDIVIDUAL', 'OTHER') 
  COMMENT '請求種別:BATCH: 一括請求, INDIVIDUAL: 個人請求, OTHER: その他'
