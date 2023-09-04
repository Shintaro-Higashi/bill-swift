import { Prisma } from '.prisma/client'

export interface IPost {
  id: string
  title: string
  content?: string
  status: 'published' | 'draft' | 'rejected'
  createdAt: string
  category: ICategory
}

export interface ICategory {
  id: string
  title: string
}

// ページング検索結果
export type PaginationResult<M> = {
  // 検索結果レコード
  items: M
  // 検索結果件数
  count: number
  // 取得した検索結果レコードの件数
  pageCount: number
}
