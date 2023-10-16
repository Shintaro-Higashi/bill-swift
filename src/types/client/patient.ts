import { PatientCreationRequest, PatientEditingRequest, PatientQueryRequest } from '@/types'

// 患者検索フォーム
export type PatientQueryForm = PatientQueryRequest & {}
// 患者作成フォーム
export type PatientCreationForm = PatientCreationRequest & {}
// 患者編集フォーム
export type PatientEditingForm = PatientEditingRequest & {}
