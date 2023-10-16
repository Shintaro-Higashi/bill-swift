import { z } from 'zod'
import { PatientCreationSchema, PatientEditingSchema, PatientQuerySchema } from '@/types'

// 患者検索リクエスト
export type PatientQueryRequest = z.infer<typeof PatientQuerySchema>
// 患者作成リクエスト
export type PatientCreationRequest = z.infer<typeof PatientCreationSchema>
// 患者編集リクエスト
export type PatientEditingRequest = z.infer<typeof PatientEditingSchema>
