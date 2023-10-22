import { HealthFacilityRelatePharmacyCreationRequest } from '@/types'

// 施設関連薬局作成Dto
export type HealthFacilityRelatePharmacyCreationDto = HealthFacilityRelatePharmacyCreationRequest & {
  // 終了日
  endDate: Date
}
