import { z } from 'zod'
import { paginationQuerySchema } from '@/types/schema/pagination'
import { zOptionalString } from '@/types/schema/base/zSchemaString'

// 薬局検索クエリスキーマ
export const PharmacyGroupQuerySchema = z
  .object({
    // ID
    id: zOptionalString(64),
    // 薬局名
    name: zOptionalString(64),
    ...paginationQuerySchema,
  })
  .partial()
