import { z } from 'zod'
import { PharmacyCreationSchema, PharmacyEditingSchema, PharmacyQuerySchema } from '@/types/schema/pharmacy'

// 店舗検索リクエスト
export type PharmacyQueryRequest = z.infer<typeof PharmacyQuerySchema>
// 店舗作成リクエスト
export type PharmacyCreationRequest = z.infer<typeof PharmacyCreationSchema>
// 店舗編集リクエスト
export type PharmacyEditingRequest = z.infer<typeof PharmacyEditingSchema>
