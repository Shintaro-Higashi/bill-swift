import { z } from 'zod'
import { paginationQuerySchema } from '@/types/schema/pagination'
import { schemaPostalCode } from '@/core/validators/schemaPostalCode'
import { schemaTel } from '@/core/validators/schemaTel'
import { schemaString, schemaStringSelectMessage } from '@/core/validators/schemaString'

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
  companyId: schemaString(64, true, schemaStringSelectMessage),
  // 薬局ID
  pharmacyGroupId: schemaString(64, true, schemaStringSelectMessage),
  // 店舗名称
  name: schemaString(64, true),
  // 店舗カナ名称
  nameKana: schemaString(128, true),
  // 医療機関コード
  medicalInstitutionCode: schemaString(16),
  // 郵便番号
  postalCode: schemaPostalCode(true),
  // 住所1
  address1: schemaString(128, true),
  // 住所2
  address2: schemaString(128),
  // 電話番号
  tel: schemaTel(true),
  // FAX番号
  fax: schemaTel(),
})

// 店舗編集スキーマ
export const PharmacyEditingSchema = PharmacyCreationSchema.extend({})
