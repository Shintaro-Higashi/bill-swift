import { z } from 'zod'
import {
  HealthFacilityRelatePharmacyCreationSchema,
  HealthFacilityRelatePharmacyEditingSchema,
} from '@/types/schema/healthFacilityRelatePharmacy'

// 施設関連薬局作成リクエスト
export type HealthFacilityRelatePharmacyCreationRequest = z.infer<typeof HealthFacilityRelatePharmacyCreationSchema>

// 施設関連薬局編集リクエスト
export type HealthFacilityRelatePharmacyEditingRequest = z.infer<typeof HealthFacilityRelatePharmacyEditingSchema>
