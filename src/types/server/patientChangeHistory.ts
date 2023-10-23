import { PatientChangeHistoryQueryRequest } from '@/types'
import { PatientChangeTypeKey } from '@/shared/items/patientChangeType'
// 患者変更履歴検索Dto
export type PatientChangeHistoryQueryDto = PatientChangeHistoryQueryRequest & {}

// 患者変更履歴作成Dto
export type PatientChangeHistoryCreationDto = {
  patientId: string
  changeType: PatientChangeTypeKey
}
// 患者変更内容作成Dto
export type PatientChangeContentCreationDto = {
  patientChangeHistoryId?: string
  itemKey: string
  childItemName: string | null
  afterValue: string | null
  beforeValue: string | null
}
