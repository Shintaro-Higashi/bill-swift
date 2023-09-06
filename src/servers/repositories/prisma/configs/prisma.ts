import { PrismaClient } from '@prisma/client'
import paginate from '@/servers/repositories/prisma/configs/extensions/paginate'
import { createPrismaQueryEventHandler } from 'prisma-query-log'
import { loggerInfo } from '@/core/configs/log'

/**
 * PrismaClientをインスタンス化します。
 * <pre>
 *  `next dev` 開発モードで実行時のwarning問題に対処しています。
 * </pre>
 * @see https://www.prisma.io/docs/guides/other/troubleshooting-orm/help-articles/nextjs-prisma-client-dev-practices
 */

const prismaClientSingleton = () => {
  const log = createPrismaQueryEventHandler({
    logger: (query: string) => loggerInfo(query),
    format: true,
    indent: '  ',
  })
  const client = new PrismaClient({ log: [{ level: 'query', emit: 'event' }] })
  client.$on('query', log)
  return client.$extends(paginate)
}

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined
}

/**
 * ORMapper prismaを扱うClientインスタンスです。
 */
export const prisma = globalForPrisma.prisma ?? prismaClientSingleton()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
