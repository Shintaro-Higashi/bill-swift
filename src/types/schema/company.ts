import { z } from 'zod'
import { paginationQuerySchema } from '@/types/schema/pagination'

// 企業検索クエリスキーマ
export const CompanyQuerySchema = z
  .object({
    // ID
    id: z.string(),
    // 企業名
    name: z.string().max(32),
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
  nameKana: z.string().max(64).nonempty(),
  // 郵便番号
  postalCode: z.string().max(8).nonempty(),
  // 住所1
  address1: z.string().max(20).nonempty(),
  // 住所2
  address2: z.string().max(20).optional(),
  // 電話番号
  tel: z.string().max(16).nonempty(),
  // FAX番号
  fax: z.string().max(16).optional(),
  // インボイス番号
  invoiceNo: z.string().max(14).optional(),
  // 金融機関コード
  financialCode: z.string().max(16).optional(),
  // 金融機関名
  financialName: z.string().max(128).optional(),
  // 支店コード
  branchCode: z.string().max(128).optional(),
  // 支店名
  branchName: z.string().max(128).optional(),
  // 口座種別
  accountType: z.string().max(1).optional(),
  // 口座番号
  accountNo: z.string().max(32).optional(),
  // 口座名
  accountName: z.string().max(128).optional(),
  // 施設コードグループID
  healthFacilityCodeGroupId: z.string(),
})

// 会社編集スキーマ
export const CompanyEditingSchema = CompanyCreationSchema.extend({})
