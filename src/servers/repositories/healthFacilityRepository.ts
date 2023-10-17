import { HealthFacilityModel, HealthFacilityQueryDto, PaginationModel } from '@/types'
import { Prisma } from '.prisma/client'
import { prisma } from '@/servers/repositories/prisma/configs/prisma'
import SortOrder = Prisma.SortOrder

/**
 * 施設のページング検索を実施します。
 * @param params 検索条件
 * @return 検索結果
 */
export const fetchPagedHealthFacilities = async (
  params: HealthFacilityQueryDto,
): Promise<PaginationModel<HealthFacilityModel>> => {
  const orderBy: Prisma.HealthFacilityOrderByWithRelationInput[] = [{ id: SortOrder.asc }]
  if (params.sort && params.order) {
    orderBy.unshift({ [params.sort]: params.order })
  }

  const entities = await prisma.healthFacility.paginate({
    where: {
      code: params.code,
      searchName: { contains: params.searchName?.replace(/[\s\u3000\u30FB]+/g, '') },
      pharmacy: { id: params.pharmacyId },
      deletedAt: null,
      existence: true,
    },
    include: {
      pharmacy: { include: { pharmacyGroup: { select: { name: true } } } },
      createdUser: true,
      updatedUser: true,
    },
    orderBy: orderBy,
    pageNo: params.pageNo,
    pageSize: params.pageSize,
  })
  return entities as unknown as PaginationModel<HealthFacilityModel>
}

/**
 * 指定IDの施設情報を取得します。
 * @param id 施設ID
 * @return 施設情報
 */
export const fetchHealthFacility = async (id: string) => {
  return await prisma.healthFacility.findUnique({
    where: { id: id, existence: true },
    include: {
      pharmacy: { include: { pharmacyGroup: { select: { name: true } } } },
      healthFacilityRelatePharmacy: {
        include: { pharmacy: { include: { pharmacyGroup: { select: { name: true } } } } },
        orderBy: { startDate: 'desc' },
      },
      accountManage: true,
      createdUser: true,
      updatedUser: true,
    },
  })
}
