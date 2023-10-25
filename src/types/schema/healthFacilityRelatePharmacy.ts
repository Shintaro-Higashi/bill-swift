import { z } from 'zod'
import { zNullishString, zRequiredString } from './base/zSchemaString'
import { zNullishDate, zRequiredDate } from './base/zSchemaDate'

// 施設関連薬局作成スキーマ
export const HealthFacilityRelatePharmacyCreationSchema = z.object({
  // 施設ID
  healthFacilityId: zRequiredString(64),
  // 薬局ID
  pharmacyId: zRequiredString(64),
  // 開始日
  startDate: zRequiredDate(),
  // 終了日
  endDate: zNullishDate(),
  // 備考
  note: zNullishString(9999),
})

// 施設関連薬局編集スキーマ
export const HealthFacilityRelatePharmacyEditingSchema = HealthFacilityRelatePharmacyCreationSchema.extend({})
