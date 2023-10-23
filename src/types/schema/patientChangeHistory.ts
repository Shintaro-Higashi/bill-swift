import { z } from 'zod'
import { paginationQuerySchema } from '@/types/schema/pagination'
import { zOptionalString } from '@/types/schema/base/zSchemaString'

// 患者変履歴検索クエリスキーマ
export const PatientChangeHistoryQuerySchema = z
  .object({
    patientId: zOptionalString(64),
    ...paginationQuerySchema,
  })
  .partial()
