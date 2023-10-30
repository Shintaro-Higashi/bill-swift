import { z } from 'zod'
import { zNullishString, zOptionalString, zRequiredString } from './base/zSchemaString'
import { zNullishDate, zRequiredDate } from './base/zSchemaDate'
import { HealthFacilityBillingType, HealthFacilityPatientSortType, HealthFacilityPaymentType } from '@prisma/client'

// 施設関連薬局検索クエリスキーマ
export const HealthFacilityRelatePharmacyQuerySchema = z
  .object({
    // コード
    code: zOptionalString(4),
  })
  .partial()

const BillingTypeEnum = z.nativeEnum(HealthFacilityBillingType)
const PaymentTypeEnum = z.nativeEnum(HealthFacilityPaymentType)
const PatientSortTypeEnum = z.nativeEnum(HealthFacilityPatientSortType)

// 施設関連薬局作成スキーマ
export const HealthFacilityRelatePharmacyCreationSchema = z.object({
  // 施設ID
  healthFacilityId: zRequiredString(64),
  // 薬局ID
  pharmacyId: zRequiredString(64),
  // 開始日
  startDate: zRequiredDate(),
  // 終了日
  endDate: zNullishDate(),
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

// 施設関連薬局編集スキーマ
export const HealthFacilityRelatePharmacyEditingSchema = HealthFacilityRelatePharmacyCreationSchema.extend({})
