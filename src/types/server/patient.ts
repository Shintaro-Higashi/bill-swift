import { PatientCreationRequest, PatientHealthFacilityEditingRequest, PatientQueryRequest } from '@/types'
import { PatientHealthFacilityChangeReasonKey } from '@/shared/items/patientHealthFacilityChangeReason'

// 患者検索Dto
export type PatientQueryDto = PatientQueryRequest & {}
// 患者作成Dto
export type PatientCreationDto = PatientCreationRequest & {
  // 請求可否フラグ
  billEnableFlag?: boolean
}
// 患者編集Dto
export type PatientEditingDto = PatientCreationRequest & {
  // 請求可否フラグ
  billEnableFlag?: boolean
}
// 患者施設変更Dto
export type PatientHealthFacilityEditingDto = {
  reason?: PatientHealthFacilityChangeReasonKey
  patientId?: string
  healthFacilityId?: string
  startDate?: Date
  endDate?: Date
  note?: string | null
}

// 患者変更履歴作成Dto
export type PatientCodeHistoryCreationDto = {
  patientId: string
  healthFacilityId: string
  patientCode: string
}
