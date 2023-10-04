import { PharmacyCreationRequest, PharmacyQueryRequest } from '@/types'

// 店舗検索Dto
export type PharmacyQueryDto = PharmacyQueryRequest & {}
// 店舗作成Dto
export type PharmacyCreationDto = PharmacyCreationRequest & {}
// 店舗編集Dto
export type PharmacyEditingDto = PharmacyCreationRequest & {}
