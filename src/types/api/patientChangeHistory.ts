import { z } from 'zod'
import { PatientChangeHistoryQuerySchema } from '@/types'

// 患者変履歴検索リクエスト
export type PatientChangeHistoryQueryRequest = z.infer<typeof PatientChangeHistoryQuerySchema>
