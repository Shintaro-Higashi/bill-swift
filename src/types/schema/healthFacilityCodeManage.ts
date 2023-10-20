import { z } from 'zod'
import { zRequiredString } from './base/zSchemaString'

// 施設コード管理作成スキーマ
export const HealthFacilityCodeManageCreationSchema = z.object({
  // 施設コードグループID
  healthFacilityCodeGroupId: zRequiredString(64),
  // 施設ID
  healthFacilityId: zRequiredString(64),
  // コード
  code: zRequiredString(4),
  // シーケンス番号
  sequenceNo: z.number().int(),
})
