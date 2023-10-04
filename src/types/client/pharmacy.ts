import { PharmacyCreationRequest, PharmacyEditingRequest, PharmacyQueryRequest } from '@/types'

// 店舗検索フォーム
export type PharmacyQueryForm = PharmacyQueryRequest & {}
// 店舗作成フォーム
export type PharmacyCreationForm = PharmacyCreationRequest & {}
// 店舗編集フォーム
export type PharmacyEditingForm = PharmacyEditingRequest & {}
