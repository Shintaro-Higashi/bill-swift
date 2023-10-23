import { PaginationModel, PatientChangeHistoryCreationDto, PatientChangeHistoryQueryDto } from '@/types'
import { Prisma } from '.prisma/client'
import { prisma } from '@/servers/repositories/prisma/configs/prisma'
import depend from '@/core/utils/velona'
import { getCurrentDate } from '@/core/utils/dateUtil'
import { getAuthorizedUserId } from '@/core/utils/requestUtil'
import { createId } from '@paralleldrive/cuid2'
import { PatientChangeHistoryModel } from '@/types/models/patientChangeHistory'
import SortOrder = Prisma.SortOrder

/**
 * 患者変更履歴のページング検索を実施します。
 * @param params 検索条件(患者IDは必須)
 * @return 検索結果
 */
export const fetchPagedPatientChangeHistories = async (
  params: PatientChangeHistoryQueryDto,
): Promise<PaginationModel<PatientChangeHistoryModel>> => {
  if (!params.patientId) throw new Error('patientId is required')
  const entities = await prisma.patientChangeHistory.paginate({
    where: {
      patientId: params.patientId,
      existence: true,
    },
    include: {
      patientChangeContent: {
        select: { id: true, itemKey: true, childItemName: true, beforeValue: true, afterValue: true },
        orderBy: [{ id: SortOrder.asc }],
      },
      createdUser: { select: { name: true } },
    },
    orderBy: [{ createdAt: SortOrder.desc }],
    pageNo: params.pageNo,
    pageSize: params.pageSize,
  })
  return entities as unknown as PaginationModel<PatientChangeHistoryModel>
}

/**
 * 患者変更履歴を作成します。
 * @param params
 */
export const createPatientChangeHistory = depend(
  { client: prisma },
  async ({ client }, params: PatientChangeHistoryCreationDto) => {
    const now = getCurrentDate()
    const userId = getAuthorizedUserId()
    return await client.patientChangeHistory.create({
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
