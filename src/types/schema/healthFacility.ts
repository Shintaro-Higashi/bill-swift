import { z } from 'zod'
import { paginationQuerySchema } from '@/types/schema/pagination'
import { PATIENT_SORT_TYPE_KEY_LIST } from '@/shared/items/patientSortType'
import createUnionSchema from '@/core/utils/zodUtil'
import { zNullishString, zOptionalString, zRequiredString } from './base/zSchemaString'
import { validatePostalCode, validatePostalCodeMessage } from '@/core/validators/validatePostalCode'
import { validateTel, validateTelMessage } from '@/core/validators/validateTel'
import { BILLING_TYPE_KEY_LIST } from '@/shared/items/billingType'
import { HEALTH_FACILITY_PAYMENT_TYPE_KEY_LIST } from '@/shared/items/healthFacilityPaymentType'
import { TRANSFER_GUIDE_KEY_LIST } from '@/shared/items/transferGuide'
import { validateEmailMessage, validateUrlMessage } from '@/core/configs/i18n/zodErrorMapJp'

// 施設検索クエリスキーマ
export const HealthFacilityQuerySchema = z
  .object({
    // コード
    code: zOptionalString(4),
    // 検索用名称
    searchName: zOptionalString(255),
    // 店舗ID
    pharmacyId: zOptionalString(64),
    ...paginationQuerySchema,
    // ソート可能なカラム
    sort: z.union([z.literal('code'), z.literal('name'), z.literal('updatedAt')]),
  })
  .partial()

// 施設作成スキーマ
export const HealthFacilityCreationSchema = z.object({
  // コード
  code: zRequiredString(4),
  // 名称
  name: zRequiredString(64),
  // カナ名称
  nameKana: zRequiredString(128),
  // 検索用名称
  searchName: zRequiredString(255),
  // 郵便番号
  postalCode: zRequiredString().refine(validatePostalCode, validatePostalCodeMessage),
  // 住所1
  address1: zRequiredString(128),
  // 住所2
  address2: zNullishString(128),
  // 電話番号
  tel: zNullishString(16).refine(validateTel, validateTelMessage),
  // FAX番号
  fax: zNullishString(16).refine(validateTel, validateTelMessage),
  // メールアドレス
  mail: zNullishString(128).pipe(z.string().email({ message: validateEmailMessage })),
  // URL
  url: zNullishString(255).pipe(z.string().url({ message: validateUrlMessage })),
  // 請求種別
  billingType: zRequiredString().pipe(createUnionSchema(BILLING_TYPE_KEY_LIST)),
  // 支払い種別
  paymentType: zRequiredString().pipe(createUnionSchema(HEALTH_FACILITY_PAYMENT_TYPE_KEY_LIST)),
  // 振込案内
  transferGuide: zRequiredString().pipe(createUnionSchema(TRANSFER_GUIDE_KEY_LIST)),
  // 患者ソート種別
  patientSortType: zRequiredString().pipe(createUnionSchema(PATIENT_SORT_TYPE_KEY_LIST)),
  // 備考
  note: zNullishString(9999),
})

// 施設編集スキーマ
export const HealthFacilityEditingSchema = HealthFacilityCreationSchema.extend({})
