import { Prisma } from '.prisma/client'
import { PAGINATE_CONFIG } from '@/core/configs/constants'

// ページネーション検索結果
type PaginationResult<T, A> = {
  // 検索結果レコード
  items: Prisma.Result<T, A, 'findMany'>
  // 検索結果件数
  count: number
  // 取得した検索結果レコードの件数
  pageCount: number
}

/**
 * Prismaクライアント拡張で全モデルにpaginateメソッドを利用可能にします。
 */
const paginate = {
  name: 'paginate',
  model: {
    $allModels: {
      /**
       * ページング検索を実地します。
       * <pre>
       *  T 操作対象モデル
       *  A メソッド実行時の引数
       * </pre>
       * @param args
       * @return ページング検索結果
       */
      async paginate<T, A>(
        this: T & { findMany: (...args: any) => any } & { count: (...args: any) => any },
        args: Prisma.Exact<A, Prisma.Args<T, 'findMany'>> & {
          pageNo: number | undefined
          pageSize: number | undefined
        },
      ): Promise<PaginationResult<T, A>> {
        const { pageNo = 1, pageSize = PAGINATE_CONFIG.DEFAULT_PAGE_SIZE } = args
        const [items, count] = await Promise.all([
          this.findMany({
            select: (args as any).select,
            include: (args as any).include,
            where: (args as any).where,
            orderBy: (args as any).orderBy,
            skip: pageSize * (pageNo - 1),
            take: pageSize,
          }),
          this.count({ select: (args as any).select, where: (args as any).where }),
        ])
        const pageCount = Math.ceil(count / pageSize)

        return { items, count, pageCount }
      },
    },
  },
}

export default paginate
