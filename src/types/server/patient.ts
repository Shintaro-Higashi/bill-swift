import { PatientCreationRequest, PatientQueryRequest } from '@/types'
import { PatientHealthFacilityChangeReasonKey } from '@/shared/items/patientHealthFacilityChangeReason'
import { PatientStatus } from '@prisma/client'

// 患者検索Dto
export type PatientQueryDto = PatientQueryRequest & {}
// 患者作成Dto
export type PatientCreationDto = PatientCreationRequest & {
  // 請求可否フラグ
  billEnableFlag?: boolean
}
// 患者編集Dto
export type PatientEditingDto = PatientCreationRequest & {
  status?: PatientStatus
  // 患者コード
  code?: string
  // 検索用名称
  searchName?: string
  // 施設ID
  healthFacilityId?: string
  // レセコン同期フラグ
  receiptSyncFlag?: boolean
  // 請求可否フラグ
  billEnableFlag?: boolean
}
// 患者施設変更Dto
export type PatientHealthFacilityEditingDto = {
  reason?: PatientHealthFacilityChangeReasonKey | null
  patientId?: string
  healthFacilityId?: string
  patientCode?: string
  startDate?: Date
  endDate?: Date
  note?: string | null
}
