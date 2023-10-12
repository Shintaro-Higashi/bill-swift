import { z } from 'zod'
import { paginationQuerySchema } from '@/types/schema/pagination'
import { zNullishString, zOptionalString, zRequiredString } from '@/types/schema/base/zSchemaString'
import { validateFixedLength, validateFixedLengthMessage } from '@/core/validators/validateFixedLength'
import createUnionSchema from '@/core/utils/zodUtil'
import { ACCOUNT_TYPE_KEY_LIST } from '@/shared/items/accountType'

// 口座管理検索クエリスキーマ
export const AccountManageQuerySchema = z
  .object({
    // 口座管理名
    name: zOptionalString(64),
    ...paginationQuerySchema,
    // ソート可能なカラム
    sort: z.union([z.literal('name'), z.literal('updatedAt')]),
  })
  .partial()

// 口座管理作成スキーマ
export const AccountManageCreationSchema = z.object({
  // 管理口座名
  name: zRequiredString(64),
  // 振替日
  transferDate: z.coerce.number().positive().int().nullish(),
  // 金融機関コード
  financialCode: zNullishString().refine((v) => validateFixedLength(v, 4), validateFixedLengthMessage(4)),
  // 金融機関名
  financialName: zNullishString(128),
  // 支店コード
  branchCode: zNullishString().refine((v) => validateFixedLength(v, 3), validateFixedLengthMessage(3)),
  // 支店名
  branchName: zNullishString(128),
  // 口座種別
  accountType: createUnionSchema(ACCOUNT_TYPE_KEY_LIST).nullish(),
  // 口座番号
  accountNo: zNullishString(7),
  // 口座名義
  accountName: zNullishString(128),
})

// 口座管理編集スキーマ
export const AccountManageEditingSchema = AccountManageCreationSchema.extend({})
