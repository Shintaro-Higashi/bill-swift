import { z } from 'zod'
import { paginationQuerySchema } from '@/types/schema/pagination'
import { schemaPostalCode } from '@/core/validators/schemaPostalCode'
import { schemaTel } from '@/core/validators/schemaTel'
import { schemaInvoiceNo } from '@/core/validators/schemaInvoiceNo'
import { schemaFixedLength } from '@/core/validators/schemaFixedLength'
import createUnionSchema from '@/core/utils/zodUtil'
import { ACCOUNT_TYPE_KEY_LIST } from '@/shared/items/accountType'
import { schemaString, schemaStringSelectMessage } from '@/core/validators/schemaString'

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
  name: schemaString(64, true),
  // 企業名フリガナ
  nameKana: schemaString(128, true),
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
  // インボイス番号
  invoiceNo: schemaInvoiceNo(),
  // 金融機関コード
  financialCode: schemaFixedLength(4),
  // 金融機関名
  financialName: schemaString(128),
  // 支店コード
  branchCode: schemaFixedLength(3),
  // 支店名
  branchName: schemaString(128),
  // 口座種別
  accountType: createUnionSchema(ACCOUNT_TYPE_KEY_LIST).nullish(),
  // 口座番号
  accountNo: schemaString(7),
  // 口座名義
  accountName: schemaString(128),
  // 施設コードグループID
  healthFacilityCodeGroupId: schemaString(64, true, schemaStringSelectMessage),
})

// 会社編集スキーマ
export const CompanyEditingSchema = CompanyCreationSchema.extend({})
