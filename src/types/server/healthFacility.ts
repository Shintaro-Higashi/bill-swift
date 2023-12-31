import { HealthFacilityCreationRequest, HealthFacilityEditingRequest, HealthFacilityQueryRequest } from '@/types'

// 施設検索Dto
export type HealthFacilityQueryDto = HealthFacilityQueryRequest & {}
// 施設作成Dto
export type HealthFacilityCreationDto = HealthFacilityCreationRequest & {
  // 施設コード
  code?: string
  // 検索用名称
  searchName?: string
}
// 施設編集Dto
export type HealthFacilityEditingDto = HealthFacilityEditingRequest & {}
