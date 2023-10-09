import { z } from 'zod'
import { UserCreationSchema, UserEditingSchema, UserQuerySchema } from '@/types/schema/user'

// ユーザ検索リクエスト
export type UserQueryRequest = z.infer<typeof UserQuerySchema>
// ユーザ作成リクエスト
export type UserCreationRequest = z.infer<typeof UserCreationSchema>
// ユーザ編集リクエスト
export type UserEditingRequest = z.infer<typeof UserEditingSchema>
