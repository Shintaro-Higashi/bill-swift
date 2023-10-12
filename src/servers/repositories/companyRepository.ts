import { CompanyCreationDto, CompanyEditingDto, CompanyModel, CompanyQueryDto, PaginationModel } from '@/types'
import { Prisma } from '.prisma/client'
import { prisma } from '@/servers/repositories/prisma/configs/prisma'
import { getCurrentDate } from '@/core/utils/dateUtil'
import { createId } from '@paralleldrive/cuid2'
import depend from '@/core/utils/velona'
import SortOrder = Prisma.SortOrder
import { getAuthorizedUserId } from '@/core/utils/requestUtil'
import IntegrityDeletedError from '@/servers/core/errors/integrityDeletedError'

/**
 * 会社のページング検索を実施します。
 * @param params 検索条件
 * @return 検索結果
 */
export const fetchPagedCompanies = async (params: CompanyQueryDto): Promise<PaginationModel<CompanyModel>> => {
  const orderBy: Prisma.CompanyOrderByWithRelationInput[] = [{ id: SortOrder.asc }]
  if (params.sort && params.order) {
    orderBy.unshift({ [params.sort]: params.order })
  }

  const entities = await prisma.company.paginate({
    where: { name: { contains: params.name }, existence: true },
    include: { createdUser: true, updatedUser: true },
    orderBy: orderBy,
    pageNo: params.pageNo,
    pageSize: params.pageSize,
  })
  return entities as unknown as PaginationModel<CompanyModel>
}

/**
 * 指定IDの会社情報を取得します。
 * @param id 会社ID
 * @return 会社情報
 */
export const fetchCompany = async (id: string) => {
  return await prisma.company.findUniqueOrThrow({
    where: { id: id, existence: true },
    include: { healthFacilityCodeGroup: true, createdUser: true, updatedUser: true },
  })
}

/**
 * 会社を作成します。
 * @param params
 */
export const createCompany = depend({ client: prisma }, async ({ client }, params: CompanyCreationDto) => {
  const now = getCurrentDate()
  const userId = getAuthorizedUserId()
  return await client.company.create({
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
 * 指定の会社情報を更新します。
 * @param id 会社ID
 * @param params 会社情報
 */
export const updateCompany = depend({ client: prisma }, async ({ client }, id: string, params: CompanyEditingDto) => {
  const now = getCurrentDate()
  return await client.company.update({
    data: {
      ...params,
      updatedBy: getAuthorizedUserId(),
      updatedAt: now,
    },
    where: { id: id, existence: true },
  })
})

/**
 * 指定の会社情報を論理削除します。
 * @param id 会社ID
 * @throws IntegrityDeletedError 使用中の所属薬局が存在する場合
 */
export const archiveCompany = depend({ client: prisma }, async ({ client }, id: string) => {
  const now = getCurrentDate()
  const archiveData = await client.company.update({
    data: {
      updatedBy: getAuthorizedUserId(),
      deletedAt: now,
    },
    where: { id: id, deletedAt: null },
  })
  const existsPharmacy = await client.pharmacy.findFirst({ where: { companyId: id, existence: true } })
  if (existsPharmacy) throw new IntegrityDeletedError()
  return archiveData
})
