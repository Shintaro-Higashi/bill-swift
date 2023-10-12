import { AccountManageQueryDto, CompanyModel, PaginationModel } from '@/types'
import { Prisma } from '.prisma/client'
import { prisma } from '@/servers/repositories/prisma/configs/prisma'
import SortOrder = Prisma.SortOrder

/**
 * 口座のページング検索を実施します。
 * @param params 検索条件
 * @return 検索結果
 */
export const fetchPagedAccountManages = async (
  params: AccountManageQueryDto,
): Promise<PaginationModel<CompanyModel>> => {
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
  return entities as unknown as PaginationModel<CompanyModel>
}
