import { z } from 'zod'
import { paginationQuerySchema } from '@/types/schema/pagination'
import { validPostalCode, validPostalCodeMessage } from '@/core/validators/validPostalCode'
import { validTel, validTelMessage } from '@/core/validators/validTel'

// 店舗検索クエリスキーマ
export const PharmacyQuerySchema = z
  .object({
    // 会社名
    companyId: z.string().max(64).nullable(),
    // 薬局名
    pharmacyGroupId: z.string().max(64).nullable(),
    // 店舗名
    name: z.string().max(64),
    ...paginationQuerySchema,
    // ソート可能なカラム
    sort: z.union([z.literal('name'), z.literal('updatedAt')]),
  })
  .partial()

// 店舗作成スキーマ
export const PharmacyCreationSchema = z.object({
  // 会社ID
  companyId: z.string().max(64).nonempty(),
  // 薬局ID
  pharmacyGroupId: z.string().max(64).nonempty(),
  // 店舗名称
  name: z.string().max(64).nonempty(),
  // 店舗カナ名称
  nameKana: z.string().max(128).nonempty(),
  // 医療機関コード
  medicalInstitutionCode: z.string().max(16).nullish(),
  // 郵便番号
  postalCode: z.string().nonempty().refine(validPostalCode, validPostalCodeMessage),
  // 住所1
  address1: z.string().max(128).nonempty(),
  // 住所2
  address2: z.string().max(128).nullish(),
  // 電話番号
  tel: z.string().max(16).nonempty().refine(validTel, validTelMessage),
  // FAX番号
  fax: z.string().max(16).refine(validTel, validTelMessage).nullish(),
})

// 店舗編集スキーマ
export const PharmacyEditingSchema = PharmacyCreationSchema.extend({})
