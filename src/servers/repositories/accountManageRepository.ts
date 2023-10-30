import {
  AccountManageCreationDto,
  AccountManageEditingDto,
  AccountManageModel,
  AccountManageQueryDto,
  PaginationModel,
} from '@/types'
import { Prisma } from '.prisma/client'
import { prisma } from '@/servers/repositories/prisma/configs/prisma'
import SortOrder = Prisma.SortOrder
import depend from '@/core/utils/velona'
import { getCurrentDate } from '@/core/utils/dateUtil'
import { getAuthorizedUserId } from '@/core/utils/requestUtil'
import { createId } from '@paralleldrive/cuid2'
import IntegrityDeletedError from '../core/errors/integrityDeletedError'

/**
 * 口座管理のページング検索を実施します。
 * @param params 検索条件
 * @return 検索結果
 */
export const fetchPagedAccountManages = async (
  params: AccountManageQueryDto,
): Promise<PaginationModel<AccountManageModel>> => {
  const orderBy: Prisma.AccountManageOrderByWithRelationInput[] = [{ id: SortOrder.asc }]
  if (params.sort && params.order) {
    orderBy.unshift({ [params.sort]: params.order })
  }

  const entities = await prisma.accountManage.paginate({
    where: { name: { contains: params.name }, existence: true },
    include: { createdUser: true, updatedUser: true },
    orderBy: orderBy,
    pageNo: params.pageNo,
    pageSize: params.pageSize,
  })
  return entities as unknown as PaginationModel<AccountManageModel>
}

/**
 * 指定IDの口座管理情報を取得します。
 * @param id 口座管理ID
 * @return 口座管理情報
 */
export const fetchAccountManage = async (id: string) => {
  return await prisma.accountManage.findUniqueOrThrow({
    where: { id: id, existence: true },
    include: { createdUser: true, updatedUser: true },
  })
}

/**
 * 口座管理を作成します。
 * @param params 口座管理情報
 */
export const createAccountManage = depend({ client: prisma }, async ({ client }, params: AccountManageCreationDto) => {
  const now = getCurrentDate()
  const userId = getAuthorizedUserId()
  return await client.accountManage.create({
    data: {
      id: createId(),
      ...params,
      createdBy: userId,
      updatedBy: userId,
      createdAt: now,
      updatedAt: now,
    },
  })
})

/**
 * 指定の口座管理情報を更新します。
 * @param id 口座管理ID
 * @param params 口座管理情報
 */
export const updateAccountManage = depend(
  { client: prisma },
  async ({ client }, id: string, params: AccountManageEditingDto) => {
    const now = getCurrentDate()
    return await client.accountManage.update({
      data: {
        ...params,
        updatedBy: getAuthorizedUserId(),
        updatedAt: now,
      },
      where: { id: id, existence: true },
    })
  },
)

/**
 * 指定の口座管理情報を論理削除します。
 * @param id 口座管理ID
 * @throws IntegrityDeletedError 使用中のデータが存在する場合
 */
export const archiveAccountManage = depend({ client: prisma }, async ({ client }, id: string) => {
  const now = getCurrentDate()
  const archiveData = await client.accountManage.update({
    data: {
      updatedBy: getAuthorizedUserId(),
      deletedAt: now,
    },
    where: { id: id, deletedAt: null },
  })
  const existPatient = await client.patient.findFirst({ where: { accountManageId: id, existence: true } })
  if (existPatient) throw new IntegrityDeletedError()
  const existFacility = await client.healthFacility.findFirst({ where: { accountManageId: id, existence: true } })
  if (existFacility) throw new IntegrityDeletedError()
  const existsPharmacy = await client.pharmacy.findFirst({
    where: {
      OR: [{ withdrawalAccountManageId: id }, { transferAccountManageId: id }],
      AND: { existence: true },
    },
  })
  if (existsPharmacy) throw new IntegrityDeletedError()
  return archiveData
})
