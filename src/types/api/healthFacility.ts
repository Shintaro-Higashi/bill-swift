import { z } from 'zod'
import {
  HealthFacilityCreationSchema,
  HealthFacilityEditingSchema,
  HealthFacilityQuerySchema,
} from '@/types/schema/healthFacility'

// 施設検索リクエスト
export type HealthFacilityQueryRequest = z.infer<typeof HealthFacilityQuerySchema>
// 施設作成リクエスト
export type HealthFacilityCreationRequest = z.infer<typeof HealthFacilityCreationSchema>
// 施設編集リクエスト
export type HealthFacilityEditingRequest = z.infer<typeof HealthFacilityEditingSchema>
