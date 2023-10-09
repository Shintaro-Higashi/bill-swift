import { z } from 'zod'
import { schemaString } from '@/core/validators/schemaString'

// ログインパラメータ
export const LoginSchema = z.object({
  // 名前
  userId: schemaString(128, true),
  // パスワード
  password: schemaString(128, true),
})
