import { z } from 'zod'
import { paginationQuerySchema } from '@/types/schema/pagination'
import {
  zNullishString,
  zOptionalString,
  zRequiredString,
  zStringSelectMessage,
} from '@/types/schema/base/zSchemaString'
import { validatePostalCode, validatePostalCodeMessage } from '@/core/validators/validatePostalCode'
import { validateTel, validateTelMessage } from '@/core/validators/validateTel'
import { validateInvoiceNo, validateInvoiceNoMessage } from '@/core/validators/validateInvoiceNo'

// 企業検索クエリスキーマ
export const CompanyQuerySchema = z
  .object({
    // 企業名
    name: zOptionalString(64),
    ...paginationQuerySchema,
    // ソート可能なカラム
    sort: z.union([z.literal('name'), z.literal('updatedAt')]),
  })
  .partial()

// 会社作成スキーマ
export const CompanyCreationSchema = z.object({
  // 企業名
  name: zRequiredString(64),
  // 企業名フリガナ
  nameKana: zRequiredString(128),
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
  // インボイス番号
  invoiceNo: zNullishString().refine(validateInvoiceNo, validateInvoiceNoMessage),
  // 施設コードグループID
  healthFacilityCodeGroupId: zRequiredString(64, zStringSelectMessage),
})

// 会社編集スキーマ
export const CompanyEditingSchema = CompanyCreationSchema.extend({})
