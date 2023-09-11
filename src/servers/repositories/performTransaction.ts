import { prisma } from '@/servers/repositories/prisma/configs/prisma'

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
