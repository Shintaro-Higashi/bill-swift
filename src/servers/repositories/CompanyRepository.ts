import { CompanyCreation, CompanyEditing, CompanyQuery } from '@/types/companies'
import { Prisma } from '.prisma/client'
import { prisma } from '@/servers/repositories/prisma/configs/prisma'
import { PaginationResult } from '@/types'
import { CompanyModel } from '@/types/models/companyModel'
import { getCurrentDate } from '@/core/utils/dateUtil'
import { createId } from '@paralleldrive/cuid2'
import depend from '@/core/utils/velona'
import SortOrder = Prisma.SortOrder

/**
 * 会社のページング検索を実地します。
 * @param params 検索条件
 * @return 検索結果
 */
export const fetchPagedCompanies = async (params: CompanyQuery): Promise<PaginationResult<CompanyModel>> => {
  const orderBy: Prisma.CompanyOrderByWithRelationInput[] = [{ id: SortOrder.asc }]
  if (params.sort && params.order) {
    orderBy.unshift({ [params.sort]: params.order })
  }

  const entities = await prisma.company.paginate({
    where: { id: params.id, name: { contains: params.name }, existence: true },
    include: { createdUser: true, updatedUser: true },
    orderBy: orderBy,
    pageNo: params.pageNo,
    pageSize: params.pageSize,
  })
  return entities as unknown as PaginationResult<CompanyModel>
}

/**
 * 指定IDの会社情報を取得します。
 * @param id 会社ID
 * @return 会社情報
 */
export const fetchCompany = async (id: string) => {
  return await prisma.company.findUnique({
    where: { id: id, existence: true },
    include: { createdUser: true, updatedUser: true },
  })
}

/**
 * 会社を作成します。
 * @param params
 */
export const createCompany = depend({ client: prisma }, async ({ client }, params: CompanyCreation) => {
  const now = getCurrentDate()
  return await client.company.create({
    data: {
      id: createId(),
      ...params,
      createdBy: '1',
      updatedBy: '1',
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
export const updateCompany = depend({ client: prisma }, async ({ client }, id: string, params: CompanyEditing) => {
  const now = getCurrentDate()
  return await client.company.update({
    data: {
      ...params,
      updatedBy: '1',
      updatedAt: now,
    },
    where: { id: id, existence: true },
  })
})

/**
 * 指定の会社情報を論理削除します。
 * @param id 会社ID
 */
export const archiveCompany = depend({ client: prisma }, async ({ client }, id: string) => {
  const now = getCurrentDate()
  return await client.company.update({
    data: {
      updatedBy: '1',
      deletedAt: now,
    },
    where: { id: id, deletedAt: null },
  })
})
