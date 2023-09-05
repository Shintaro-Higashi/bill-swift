import { z } from 'zod'
import { CompanyCreationSchema, CompanyEditingSchema, CompanyQuerySchema } from '@/types/schema/company'

// 会社検索リクエスト
export type CompanyQueryRequest = z.infer<typeof CompanyQuerySchema>
// 会社作成リクエスト
export type CompanyCreationRequest = z.infer<typeof CompanyCreationSchema>
// 会社編集リクエスト
export type CompanyEditingRequest = z.infer<typeof CompanyEditingSchema>
