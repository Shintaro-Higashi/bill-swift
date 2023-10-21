import { PatientCreationRequest, PatientQueryRequest } from '@/types'

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
