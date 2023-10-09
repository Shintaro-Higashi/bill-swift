import { z } from 'zod'
import createUnionSchema from '@/core/utils/zodUtil'
import { schemaString } from '@/core/validators/schemaString'
import { USER_TYPE_KEY_LIST } from '@/shared/items/userType'
import { paginationQuerySchema } from '@/types/schema/pagination'

// ユーザ検索スキーマ
export const UserQuerySchema = z
  .object({
    // 名前
    name: z.string().max(64),
    ...paginationQuerySchema,
    // ソート可能なカラム
    sort: z.union([z.literal('name'), z.literal('updatedAt')]),
  })
  .partial()

// ユーザ作成スキーマ
export const UserCreationSchema = z.object({
  // ユーザ種別
  userType: createUnionSchema(USER_TYPE_KEY_LIST),
  // 氏名
  name: schemaString(64, true),
  // ログインユーザID
  userId: schemaString(64),
  // パスワード
  password: schemaString(64, true),
  // 薬局ID
  pharmacyId: schemaString(64),
  // 患者ID
  patientId: schemaString(64),
})

// ユーザ編集スキーマ
export const UserEditingSchema = UserCreationSchema.extend({})
