import { HealthFacilityRelatePharmacyCreationDto, HealthFacilityRelatePharmacyEditingDto } from '@/types'
import { prisma } from '@/servers/repositories/prisma/configs/prisma'
import depend from '@/core/utils/velona'
import { getCurrentDate } from '@/core/utils/dateUtil'
import { getAuthorizedUserId } from '@/core/utils/requestUtil'
import { createId } from '@paralleldrive/cuid2'

/**
 * 施設関連薬局を作成します。
 * @param healthFacilityId
 * @param pharmacyId
 * @param startDate
 */
export const createHealthFacilityRelatePharmacy = depend(
  { client: prisma },
  async ({ client }, params: HealthFacilityRelatePharmacyCreationDto) => {
    const now = getCurrentDate()
    const userId = getAuthorizedUserId()

    return await client.healthFacilityRelatePharmacy.create({
      data: {
        ...params,
        id: createId(),
        createdBy: userId,
        updatedBy: userId,
        createdAt: now,
        updatedAt: now,
      },
    })
  },
)

/**
 * 指定の施設関連薬局を更新します。
 * @param id 施設関連薬局ID
 * @param params 施設関連薬局情報
 */
export const updateHealthFacilityRelatePharmacy = depend(
  { client: prisma },
  async ({ client }, id: string, params: HealthFacilityRelatePharmacyEditingDto) => {
    const now = getCurrentDate()
    return await client.healthFacilityRelatePharmacy.update({
      data: {
        startDate: params.startDate,
        updatedBy: getAuthorizedUserId(),
        updatedAt: now,
      },
      where: { id: id, existence: true },
    })
  },
)
