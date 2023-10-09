import { z } from 'zod'
import { LoginSchema } from '@/types/schema/auth'

// ログインリクエスト
export type LoginRequest = z.infer<typeof LoginSchema>
