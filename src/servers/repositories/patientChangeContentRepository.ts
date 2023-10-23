import { PatientChangeContentCreationDto } from '@/types'

import { prisma } from '@/servers/repositories/prisma/configs/prisma'
import depend from '@/core/utils/velona'
import { getCurrentDate } from '@/core/utils/dateUtil'
import { getAuthorizedUserId } from '@/core/utils/requestUtil'
import { createId } from '@paralleldrive/cuid2'
import { Prisma } from '.prisma/client'

/**
 * 患者変更内容を作成します。
 * @param params
 */
export const createManyPatientChangeContent = depend(
  { client: prisma },
  async ({ client }, patientChangeHistoryId: string, creationDtoList: PatientChangeContentCreationDto[]) => {
    const now = getCurrentDate()
    const userId = getAuthorizedUserId()
    const creationEntities: Prisma.PatientChangeContentUncheckedCreateInput[] = creationDtoList.map((creationDto) => ({
      ...creationDto,
      id: createId(),
      patientChangeHistoryId,
      createdBy: userId,
      updatedBy: userId,
      createdAt: now,
      updatedAt: now,
    }))
    return await client.patientChangeContent.createMany({ data: creationEntities })
  },
)
