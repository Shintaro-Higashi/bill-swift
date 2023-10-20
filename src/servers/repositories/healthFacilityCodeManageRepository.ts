import { HealthFacilityCodeManageCreationDto } from '@/types'
import { prisma } from '@/servers/repositories/prisma/configs/prisma'
import depend from '@/core/utils/velona'
import { getCurrentDate } from '@/core/utils/dateUtil'
import { getAuthorizedUserId } from '@/core/utils/requestUtil'
import { createId } from '@paralleldrive/cuid2'

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
