import { z } from 'zod'
import { paginationQuerySchema } from '@/types/schema/pagination'
import { zNullishString, zOptionalString, zRequiredString } from '@/types/schema/base/zSchemaString'
import { validatePostalCode, validatePostalCodeMessage } from '@/core/validators/validatePostalCode'
import { validateTel, validateTelMessage } from '@/core/validators/validateTel'
import {
  PatientAccountConfirmStatus,
  PatientConsentStatus,
  PatientGender,
  PatientMedicalInsuranceStatus,
  PatientMedicalShare,
  PatientNursingInsuranceStatus,
  PatientNursingShare,
  PatientPaymentType,
} from '@prisma/client'
import { zNullishDate } from '@/types/schema/base/zSchemaDate'

// 患者検索クエリスキーマ
export const PatientQuerySchema = z
  .object({
    // 検索用氏名
    searchName: zOptionalString(255),
    // 患者番号
    code: zOptionalString(8),
    // 担当店舗
    pharmacyId: zOptionalString(64),
    // 所属施設
    healthFacilityId: zOptionalString(64),
    // 請求できない患者のみを対象とするフラグ
    billDisableFlag: z.coerce
      .boolean()
      .transform((val) => (!val ? undefined : val))
      .nullish(),
    ...paginationQuerySchema,
    // ソート可能なカラム
    sort: z.union([z.literal('code'), z.literal('name'), z.literal('updatedAt')]),
  })
  .partial()

// 患者作成スキーマ
export const PatientCreationSchema = z.object({
  // 患者名
  name: zRequiredString(64),
  // 患者名カナ
  nameKana: zRequiredString(128),
  // 性別
  gender: z.nativeEnum(PatientGender),
  // 生年月日
  birthday: zNullishDate(),
  // 医療保険ステータス
  medicalInsuranceStatus: z.nativeEnum(PatientMedicalInsuranceStatus),
  // 医療保険開始日
  medicalInsuranceStartDate: zNullishDate(),
  // 医療保険終了日
  medicalInsuranceEndDate: zNullishDate(),
  // 医療負担割合証確認日
  medicalShareConfirmDate: zNullishDate(),
  // 医療負担割合
  medicalShare: z
    .nativeEnum(PatientMedicalShare)
    .nullish()
    .transform((v) => (v === undefined ? null : v)),
  // 介護保険ステータス
  nursingInsuranceStatus: z.nativeEnum(PatientNursingInsuranceStatus),
  // 介護保険開始日
  nursingInsuranceStartDate: zNullishDate(),
  // 介護保険終了日
  nursingInsuranceEndDate: zNullishDate(),
  // 介護負担割合証確認日
  nursingShareConfirmDate: zNullishDate(),
  // 介護負担割合
  nursingShare: z
    .nativeEnum(PatientNursingShare)
    .nullish()
    .transform((v) => (v === undefined ? null : v)),
  // 同意書ステータス
  consentStatus: z.nativeEnum(PatientConsentStatus),
  // 同意書確認日
  consentConfirmDate: zNullishDate(),
  // 支払種別
  paymentType: z.nativeEnum(PatientPaymentType),
  // 口座振替確認状態
  accountConfirmStatus: z
    .nativeEnum(PatientAccountConfirmStatus)
    .nullish()
    .transform((v) => (v === undefined ? null : v)),
  // 振替口座管理ID
  accountManageId: zNullishString(64),
  // 公費フラグ
  publicExpense: z.boolean().nullable(),
  // 送付先氏名
  deliveryName: zNullishString(64),
  // 送付先郵便番号
  deliveryPostalCode: zNullishString().refine(validatePostalCode, validatePostalCodeMessage),
  // 送付先住所1
  deliveryAddress1: zNullishString(20),
  // 送付先住所2
  deliveryAddress2: zNullishString(20),
  // 送付先電話番号
  deliveryTel: zNullishString(16).refine(validateTel, validateTelMessage),
  // 施設情報
  healthFacilityInfo: zNullishString(255),
  // 備考
  note: zNullishString(9999),
})

// 患者編集スキーマ
export const PatientEditingSchema = PatientCreationSchema.extend({})
