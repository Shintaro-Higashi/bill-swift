import { HealthFacilityCodeManageCreationDto } from '@/types'
import { prisma } from '@/servers/repositories/prisma/configs/prisma'
import depend from '@/core/utils/velona'
import { getCurrentDate } from '@/core/utils/dateUtil'
import { getAuthorizedUserId } from '@/core/utils/requestUtil'
import { createId } from '@paralleldrive/cuid2'
import { Prisma } from '@prisma/client'

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
 * 指定の施設コードグループIDで最大の施設コードを取得します。
 * @param healthFacilityCodeGroupId 施設コードグループID
 * @param assignableCodes 採番不可コード配列
 */
export const getMaxCode = depend(
  { client: prisma },
  async ({ client }, healthFacilityCodeGroupId: string, assignableCodes: string[]) => {
    const resultList: any =
      await client.$queryRaw`SELECT MAX(CAST(code as SIGNED)) as code FROM health_facility_code_manage WHERE health_facility_code_group_id = ${healthFacilityCodeGroupId} AND code NOT IN (${Prisma.join(
        assignableCodes,
      )})`
    // MAXを取得しているので結果は1件のみとなるため先頭データを返却する
    if (resultList.length > 0) {
      return resultList[0]
    }
    return null
  },
)
