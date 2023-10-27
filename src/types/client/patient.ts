import {
  PatientCreationRequest,
  PatientEditingRequest,
  PatientEditingSchema,
  PatientHealthFacilityEditingRequest,
  PatientQueryRequest,
} from '@/types'
import React from 'react'

// 患者検索フォーム
export type PatientQueryForm = PatientQueryRequest & {}
// 患者作成フォーム
export type PatientCreationForm = PatientCreationRequest & {}
// 患者編集フォーム
export type PatientEditingForm = PatientEditingRequest & {}
// 患者編集フォームで利用可能なフィールド名
export type PatientEditingFormFieldName = keyof typeof PatientEditingSchema.shape
// 患者詳細画面で現在編集中のBox状態(nullはどれも未編集)
export type BoxEditStatus = 'profile' | 'delivery' | 'checkList' | 'note' | 'files' | null

// 患者詳細各情報のどのPaperBoxが編集中かを示すステータス情報
export type BoxEditProps = {
  boxEditStatus: BoxEditStatus
  setBoxEditStatus: React.Dispatch<React.SetStateAction<BoxEditStatus>>
}
// 患者関連施設変更Form
export type PatientHealthFacilityEditingForm = PatientHealthFacilityEditingRequest & {
  patientRelateHealthFacilityId?: string
}
