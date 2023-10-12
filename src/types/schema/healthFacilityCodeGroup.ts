import { z } from 'zod'
import { paginationQuerySchema } from '@/types/schema/pagination'
import { zOptionalString } from '@/types/schema/base/zSchemaString'

// 施設コードグループ検索クエリスキーマ
export const HealthFacilityCodeGroupQuerySchema = z
  .object({
    // ID
    id: zOptionalString(64),
    // 施設コードグループ名
    name: zOptionalString(64),
    ...paginationQuerySchema,
  })
  .partial()
