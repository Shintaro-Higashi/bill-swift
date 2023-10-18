import { PharmacyGroupModel, PharmacyGroupQueryDto, PaginationModel } from '@/types'
import { Prisma } from '.prisma/client'
import { prisma } from '@/servers/repositories/prisma/configs/prisma'
import SortOrder = Prisma.SortOrder

/**
 * 薬局のページング検索を実施します。
 * @param params 検索条件
 * @return 検索結果
 */
export const fetchPagedPharmacyGroups = async (
  params: PharmacyGroupQueryDto,
): Promise<PaginationModel<PharmacyGroupModel>> => {
  const orderBy: Prisma.PharmacyGroupOrderByWithRelationInput[] = [{ id: SortOrder.asc }]
  const entities = await prisma.pharmacyGroup.paginate({
    where: {
      id: params.id,
      ...(params.name !== undefined
        ? { OR: [{ name: { contains: params.name } }, { nameKana: { contains: params.name } }] }
        : {}),
      existence: true,
    },
    orderBy: orderBy,
    pageNo: params.pageNo,
    pageSize: params.pageSize,
  })
  return entities as unknown as PaginationModel<PharmacyGroupModel>
}

/**
 * 指定IDの薬局情報を取得します。
 * @param id 薬局ID
 * @return 薬局情報
 */
export const fetchPharmacyGroup = async (id: string) => {
  return await prisma.pharmacyGroup.findUnique({
    where: { id: id, existence: true },
  })
}
