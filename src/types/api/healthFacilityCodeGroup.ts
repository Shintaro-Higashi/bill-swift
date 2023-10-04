import { z } from 'zod'
import { HealthFacilityCodeGroupQuerySchema } from '@/types/schema/healthFacilityCodeGroup'

// 施設コードグループ検索リクエスト
export type HealthFacilityCodeGroupQueryRequest = z.infer<typeof HealthFacilityCodeGroupQuerySchema>
