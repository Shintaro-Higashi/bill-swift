import { z } from 'zod'
import { paginationQuerySchema } from '@/types/schema/pagination'
import { validatePostalCode, validatePostalCodeMessage } from '@/core/validators/validatePostalCode'
import { validateTel, validateTelMessage } from '@/core/validators/validateTel'
import {
  zNullishString,
  zOptionalString,
  zRequiredString,
  zStringSelectMessage,
} from '@/types/schema/base/zSchemaString'

// 店舗検索クエリスキーマ
export const PharmacyQuerySchema = z
  .object({
    // 会社名
    companyId: zOptionalString(64),
    // 薬局名
    pharmacyGroupId: zOptionalString(64),
    // 店舗名
    name: zOptionalString(64),
    ...paginationQuerySchema,
    // ソート可能なカラム
    sort: z.union([z.literal('name'), z.literal('updatedAt')]),
  })
  .partial()

// 店舗作成スキーマ
export const PharmacyCreationSchema = z.object({
  // 会社ID
  companyId: zRequiredString(64, zStringSelectMessage),
  // 薬局ID
  pharmacyGroupId: zRequiredString(64, zStringSelectMessage),
  // 店舗名称
  name: zRequiredString(64),
  // 店舗カナ名称
  nameKana: zRequiredString(64),
  // 医療機関コード
  medicalInstitutionCode: zNullishString(16),
  // 郵便番号
  postalCode: zRequiredString().refine(validatePostalCode, validatePostalCodeMessage),
  // 住所1
  address1: zRequiredString(128),
  // 住所2
  address2: zNullishString(128),
  // 電話番号
  tel: zRequiredString(16).refine(validateTel, validateTelMessage),
  // FAX番号
  fax: zNullishString(16).refine(validateTel, validateTelMessage),
  // 振替口座管理ID
  withdrawalAccountManageId: zRequiredString(64, zStringSelectMessage),
  // 振込口座管理ID
  transferAccountManageId: zRequiredString(64, zStringSelectMessage),
})

// 店舗編集スキーマ
export const PharmacyEditingSchema = PharmacyCreationSchema.extend({})
