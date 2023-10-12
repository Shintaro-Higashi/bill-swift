import { z } from 'zod'

import { zRequiredString } from '@/types/schema/base/zSchemaString'

// ログインパラメータ
export const LoginSchema = z.object({
  // 名前
  userId: zRequiredString(128),
  // パスワード
  password: zRequiredString(64),
})
