import {
  HealthFacilityRelatePharmacyQueryRequest,
  HealthFacilityRelatePharmacyCreationRequest,
  HealthFacilityRelatePharmacyEditingRequest,
} from '@/types'

// 施設関連薬局検索Dto
export type HealthFacilityRelatePharmacyQueryDto = HealthFacilityRelatePharmacyQueryRequest & {}
// 施設関連薬局作成Dto
export type HealthFacilityRelatePharmacyCreationDto = HealthFacilityRelatePharmacyCreationRequest & {
  // 終了日
  endDate: Date
}
// 施設関連薬局編集Dto
export type HealthFacilityRelatePharmacyEditingDto = HealthFacilityRelatePharmacyEditingRequest & {}
