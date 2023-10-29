import { z } from 'zod'
import { paginationQuerySchema } from '@/types/schema/pagination'
import { zNullishString, zOptionalString, zRequiredString, zStringSelectMessage } from './base/zSchemaString'
import { validatePostalCode, validatePostalCodeMessage } from '@/core/validators/validatePostalCode'
import { validateTel, validateTelMessage } from '@/core/validators/validateTel'
import { validateEmailMessage, validateUrlMessage } from '@/core/configs/i18n/zodErrorMapJp'
import { zRequiredDate } from './base/zSchemaDate'
import { HealthFacilityBillingType, HealthFacilityPaymentType, HealthFacilityPatientSortType } from '.prisma/client'

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

const BillingTypeEnum = z.nativeEnum(HealthFacilityBillingType)
const PaymentTypeEnum = z.nativeEnum(HealthFacilityPaymentType)
const PatientSortTypeEnum = z.nativeEnum(HealthFacilityPatientSortType)

// 施設作成スキーマ
export const HealthFacilityCreationSchema = z.object({
  // 対応開始日
  startDate: zRequiredDate(),
  // 店舗ID
  pharmacyId: zRequiredString(64),
  // 名称
  name: zRequiredString(64),
  // カナ名称
  nameKana: zRequiredString(128),
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
  mail: zNullishString(128).pipe(z.string().email({ message: validateEmailMessage }).nullish()),
  // URL
  url: zNullishString(255).pipe(z.string().url({ message: validateUrlMessage }).nullish()),
  // 請求種別
  billingType: BillingTypeEnum.nullish().transform((v) => (v === undefined ? null : v)),
  // 支払い種別
  paymentType: PaymentTypeEnum.nullish().transform((v) => (v === undefined ? null : v)),
  // 口座管理ID
  accountManageId: zNullishString(64),
  // 患者ソート種別
  patientSortType: zRequiredString().pipe(PatientSortTypeEnum),
  // 備考
  note: zNullishString(9999),
})

// 施設編集スキーマ
export const HealthFacilityEditingSchema = HealthFacilityCreationSchema.extend({})
