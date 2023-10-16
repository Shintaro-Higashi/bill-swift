import { z } from 'zod'
import { paginationQuerySchema } from '@/types/schema/pagination'
import { zNullishString, zOptionalString, zRequiredString } from '@/types/schema/base/zSchemaString'
import { validatePostalCode, validatePostalCodeMessage } from '@/core/validators/validatePostalCode'
import { validateTel, validateTelMessage } from '@/core/validators/validateTel'
import createUnionSchema from '@/core/utils/zodUtil'
import { GENDER_KEY_LIST } from '@/shared/items/gender'
import { INSURANCE_STATUS_KEY_LIST } from '@/shared/items/medicalInsuranceStatus'
import { MEDICAL_NURSING_SHARE_KEY_LIST } from '@/shared/items/medicalNursingShare'
import { CONSENT_STATUS_KEY_LIST } from '@/shared/items/consentStatus'

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
  gender: createUnionSchema(GENDER_KEY_LIST),
  // 生年月日
  birthday: z.coerce.date().nullish(),
  // 医療保険ステータス
  medicalInsuranceStatus: createUnionSchema(INSURANCE_STATUS_KEY_LIST).nullish(),
  // 医療保険開始日
  medicalInsuranceStartDate: z.coerce.date().nullish(),
  // 医療保険終了日
  medicalInsuranceEndDate: z.coerce.date().nullish(),
  // 医療負担割合証確認日
  medicalShareConfirmDate: z.coerce.date().nullish(),
  // 医療負担割合
  medicalShare: createUnionSchema(MEDICAL_NURSING_SHARE_KEY_LIST).nullish(),
  // 介護保険ステータス
  nursingInsuranceStatus: createUnionSchema(INSURANCE_STATUS_KEY_LIST).nullish(),
  // 介護保険開始日
  nursingInsuranceStartDate: z.coerce.date().nullish(),
  // 介護保険終了日
  nursingInsuranceEndDate: z.coerce.date().nullish(),
  // 介護負担割合証確認日
  nursingShareConfirmDate: z.coerce.date().nullish(),
  // 介護負担割合
  nursingShare: createUnionSchema(MEDICAL_NURSING_SHARE_KEY_LIST).nullish(),
  // 同意書ステータス
  consentStatus: createUnionSchema(CONSENT_STATUS_KEY_LIST).nullish(),
  // 同意書確認日
  consentConfirmDate: zNullishString(64),
  // TODO 支払い種別 enum化
  paymentType: createUnionSchema(CONSENT_STATUS_KEY_LIST).nullish(),
  // 口座振替確認状態
  accountConfirmStatus: zNullishString(64),
  // 振替口座管理ID
  accountManageId: zNullishString(64),
  // 公費フラグ
  publicExpense: zNullishString(64),
  // レセコン同期フラグ
  receptSyncFlag: z.boolean(),
  // 送付先氏名
  deliveryName: zNullishString(64),
  // 送付先郵便番号
  deliveryPostalCode: zNullishString().refine(validatePostalCode, validatePostalCodeMessage),
  // 送付先住所1
  deliveryAddress1: zNullishString(20),
  // 送付先住所2
  deliveryAddress2: zNullishString(20),
  // 送付先電話番号
  deliveryTel: zRequiredString(16).refine(validateTel, validateTelMessage),
  // 施設情報
  healthFacilityInfo: zNullishString(255),
  // 備考
  note: zNullishString(9999),
})

// 患者編集スキーマ
export const PatientEditingSchema = PatientCreationSchema.extend({})
