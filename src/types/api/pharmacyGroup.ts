import { z } from 'zod'
import { PharmacyGroupQuerySchema } from '@/types/schema/pharmacyGroup'

// 薬局検索リクエスト
export type PharmacyGroupQueryRequest = z.infer<typeof PharmacyGroupQuerySchema>
