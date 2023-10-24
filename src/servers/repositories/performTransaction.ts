import { prisma } from '@/servers/repositories/prisma/configs/prisma'
import { PrismaClient } from '@prisma/client'

/**
 * トランザクションを制御します。
 *
 * @param callback repository関数
 * @return callback結果
 */
export const performTransaction = async (callback: Function) => {
  return prisma.$transaction(async (tx) => {
    return await callback(tx)
  })
}

/**
 * repository関数の依存prismaClientを指定のclientに差し替えます。
 * <pre>
 *   performTransaction callback内で利用します。
 * </pre>
 * @param func repository関数
 * @param tx トランザクション開始中prismaClient
 */
export const injectTransaction = <T extends Function>(func: T, tx: PrismaClient): T => {
  return (func as any).inject({ client: tx }) as T
}
