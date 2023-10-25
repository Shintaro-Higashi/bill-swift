import { HealthFacilityCodeManageCreationDto, HealthFacilityCodeManageModel } from '@/types'
import { prisma } from '@/servers/repositories/prisma/configs/prisma'
import depend from '@/core/utils/velona'
import { getCurrentDate } from '@/core/utils/dateUtil'
import { getAuthorizedUserId } from '@/core/utils/requestUtil'
import { createId } from '@paralleldrive/cuid2'
import { Prisma } from '.prisma/client'
import { fetchHealthFacility } from '@/servers/repositories/healthFacilityRepository'

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

/**
 * 施設コード管理を作成します。
 * @param 登録情報
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

    const healthFacility = await fetchHealthFacility(healthFacilityId)
    const {
      pharmacy: {
        company: { healthFacilityCodeGroupId },
      },
    } = healthFacility
    // コードグループIDと施設IDでユニークに特定可
    const healthFacilityCodeManage = await client.healthFacilityCodeManage.findUniqueOrThrow({
      where: {
        healthFacilityId_healthFacilityCodeGroupId: {
          healthFacilityId,
          healthFacilityCodeGroupId,
        },
        existence: true,
      },
    })

    // const latestCodeManage = await fetchLatestHealthFacilityCodeManage(healthFacilityId)
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
        id: healthFacilityCodeManage.id,
        existence: true,
      },
    })) as unknown as HealthFacilityCodeManageModel
  },
)
