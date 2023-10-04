import { z } from 'zod'
import { paginationQuerySchema } from '@/types/schema/pagination'

// 薬局検索クエリスキーマ
export const PharmacyGroupQuerySchema = z
  .object({
    // ID
    id: z.string(),
    // 薬局名
    name: z.string().max(64),
    ...paginationQuerySchema,
  })
  .partial()
