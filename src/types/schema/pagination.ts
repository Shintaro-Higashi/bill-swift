import { z } from 'zod'

const OrderType = z.union([z.literal('asc'), z.literal('desc')])

// 検索クエリに利用するページーション関連のパラメータ
export const paginationQuerySchema = {
  pageNo: z.coerce.number().positive().int(),
  pageSize: z.coerce.number().positive().int().lte(300),
  sort: z.string(),
  order: OrderType,
}
