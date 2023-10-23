import { z } from 'zod'
import { paginationQuerySchema } from '@/types/schema/pagination'
import { zNullishString, zOptionalString, zRequiredString } from '@/types/schema/base/zSchemaString'
import { UserUserType } from '@prisma/client'

// ユーザ検索スキーマ
export const UserQuerySchema = z
  .object({
    // 名前
    name: zOptionalString(64),
    ...paginationQuerySchema,
    // ソート可能なカラム
    sort: z.union([z.literal('name'), z.literal('updatedAt')]),
  })
  .partial()

// ユーザ作成スキーマ
export const UserCreationSchema = z.object({
  // ユーザ種別
  userType: z
    .nativeEnum(UserUserType)
    .nullish()
    .transform((v) => (v === undefined ? null : v)),
  // 氏名
  name: zRequiredString(64),
  // ログインユーザID
  userId: zRequiredString(64),
  // パスワード
  password: zRequiredString(64),
  // 薬局ID
  pharmacyId: zNullishString(64),
  // 患者ID
  patientId: zNullishString(64),
})

// ユーザ編集スキーマ
export const UserEditingSchema = UserCreationSchema.extend({})
