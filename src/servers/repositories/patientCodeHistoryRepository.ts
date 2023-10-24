import { PatientCodeHistoryCreationDto } from '@/types'
import { Prisma } from '.prisma/client'
import { prisma } from '@/servers/repositories/prisma/configs/prisma'
import depend from '@/core/utils/velona'
import { getCurrentDate } from '@/core/utils/dateUtil'
import { getAuthorizedUserId } from '@/core/utils/requestUtil'
import { createId } from '@paralleldrive/cuid2'

/**
 * 患者コード履歴を作成します。
 * @param params
 */
export const createPatientCodeHistory = depend(
  { client: prisma },
  async ({ client }, params: PatientCodeHistoryCreationDto) => {
    const now = getCurrentDate()
    const userId = getAuthorizedUserId()
    return await client.patientCodeHistory.create({
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
