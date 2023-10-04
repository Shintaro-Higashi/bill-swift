import { z } from 'zod'
import { paginationQuerySchema } from '@/types/schema/pagination'
import { validPostalCode, validPostalCodeMessage } from '@/core/validators/validPostalCode'
import { validTel, validTelMessage } from '@/core/validators/validTel'
import { validInvoiceNo, validInvoiceNoMessage } from '@/core/validators/validInvoiceNo'
import { validFixedLength, validFixedLengthMessage } from '@/core/validators/validFixedLength'
import createUnionSchema from '@/core/utils/zodUtil'
import { ACCOUNT_TYPE_KEY_LIST } from '@/shared/items/accountType'

// 企業検索クエリスキーマ
export const CompanyQuerySchema = z
  .object({
    // 企業名
    name: z.string().max(64),
    ...paginationQuerySchema,
    // ソート可能なカラム
    sort: z.union([z.literal('name'), z.literal('updatedAt')]),
  })
  .partial()

// 会社作成スキーマ
export const CompanyCreationSchema = z.object({
  // 企業名
  name: z.string().max(64).nonempty(),
  // 企業名フリガナ
  nameKana: z.string().max(128).nonempty(),
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
  // インボイス番号
  invoiceNo: z.string().max(14).refine(validInvoiceNo, validInvoiceNoMessage).nullish(),
  // 金融機関コード
  financialCode: z
    .string()
    .nullish()
    .refine((val) => validFixedLength(val, 4), validFixedLengthMessage(4)),
  // 金融機関名
  financialName: z.string().max(128).nullish(),
  // 支店コード
  branchCode: z
    .string()
    .nullish()
    .refine((val) => validFixedLength(val, 3), validFixedLengthMessage(3)),
  // 支店名
  branchName: z.string().max(128).nullish(),
  // 口座種別
  accountType: createUnionSchema(ACCOUNT_TYPE_KEY_LIST).nullish(),
  // 口座番号
  accountNo: z.string().max(7).nullish(),
  // 口座名義
  accountName: z.string().max(128).nullish(),
  // 施設コードグループID
  healthFacilityCodeGroupId: z.string().max(64).nonempty(),
})

// 会社編集スキーマ
export const CompanyEditingSchema = CompanyCreationSchema.extend({})
