import { HealthFacilityCodeManageCreationDto, HealthFacilityCodeManageModel } from '@/types'
import { prisma } from '@/servers/repositories/prisma/configs/prisma'
import depend from '@/core/utils/velona'
import { getCurrentDate } from '@/core/utils/dateUtil'
import { getAuthorizedUserId } from '@/core/utils/requestUtil'
import { createId } from '@paralleldrive/cuid2'
import { Prisma } from '.prisma/client'
import SortOrder = Prisma.SortOrder

/**
 * 指定施設IDの最新の施設コード管理情報を取得します。
 * @param healthFacilityId 施設ID
 * @return 最新の施設コード管理情報
 */
export const fetchLatestHealthFacilityCodeManage = depend(
  { client: prisma },
  async ({ client }, healthFacilityId: string) => {
    return client.healthFacilityCodeManage.findFirstOrThrow({
      where: { healthFacilityId, existence: true },
      orderBy: { createdAt: SortOrder.desc },
    })
  },
)

/**
 * 施設コード管理を作成します。
 * @param healthFacilityCodeGroupId
 * @param healthFacilityId
 * @param code
 */
export const createHealthFacilityCodeManage = depend(
  { client: prisma },
  async ({ client }, params: HealthFacilityCodeManageCreationDto) => {
    const now = getCurrentDate()
    const userId = getAuthorizedUserId()

    return await client.healthFacilityCodeManage.create({
      data: {
        id: createId(),
        ...params,
        createdBy: userId,
        updatedBy: userId,
        createdAt: now,
        updatedAt: now,
      },
    })
  },
)

/**
 * 指定施設IDの最新施設コード管理のシーケンス番号をインクリメントします。
 * @param healthFacilityId 施設ID
 * @return シーケンス番号をインクリメント後の最新施設コード管理情報
 */
export const incrementHealthFacilityCodeManageSequenceNo = depend(
  { client: prisma },
  async ({ client }, healthFacilityId: string) => {
    const now = getCurrentDate()
    const userId = getAuthorizedUserId()

    const latestCodeManage = await fetchLatestHealthFacilityCodeManage(healthFacilityId)
    return (await client.healthFacilityCodeManage.update({
      data: {
        sequenceNo: {
          increment: 1,
        },
        createdBy: userId,
        updatedBy: userId,
        createdAt: now,
        updatedAt: now,
      },
      include: {
        healthFacilityCodeGroup: true,
      },
      where: {
        id: latestCodeManage.id,
        existence: true,
      },
    })) as unknown as HealthFacilityCodeManageModel
  },
)
