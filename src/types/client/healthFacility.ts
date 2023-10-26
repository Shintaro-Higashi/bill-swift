import {
  AssignedPharmacyEditingRequest,
  HealthFacilityCreationRequest,
  HealthFacilityEditingRequest,
  HealthFacilityQueryRequest,
} from '@/types'

// 施設検索フォーム
export type HealthFacilityQueryForm = HealthFacilityQueryRequest & {}
// 施設作成フォーム
export type HealthFacilityCreationForm = HealthFacilityCreationRequest & {}
// 施設編集フォーム
export type HealthFacilityEditingForm = HealthFacilityEditingRequest & {}
// 担当店舗編集フォーム
export type AssignedPharmacyEditingForm = AssignedPharmacyEditingRequest & {}
