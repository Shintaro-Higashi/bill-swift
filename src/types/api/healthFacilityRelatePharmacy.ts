import { z } from 'zod'
import { HealthFacilityRelatePharmacyCreationSchema } from '@/types/schema/healthFacilityRelatePharmacy'

// 施設関連薬局作成リクエスト
export type HealthFacilityRelatePharmacyCreationRequest = z.infer<typeof HealthFacilityRelatePharmacyCreationSchema>
