import { z } from 'zod'
import { paginationQuerySchema } from '@/types/schema/pagination'

// 施設コードグループ検索クエリスキーマ
export const HealthFacilityCodeGroupQuerySchema = z
  .object({
    // ID
    id: z.string(),
    // 施設コードグループ名
    name: z.string().max(64),
    ...paginationQuerySchema,
  })
  .partial()
