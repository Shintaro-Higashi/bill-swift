import { HealthFacilityCodeGroupModel, HealthFacilityCodeGroupQueryDto, PaginationModel } from '@/types'
import { Prisma } from '.prisma/client'
import { prisma } from '@/servers/repositories/prisma/configs/prisma'
import SortOrder = Prisma.SortOrder

/**
 * 施設コードグループのページング検索を実施します。
 * @param params 検索条件
 * @return 検索結果
 */
export const fetchPagedHealthFacilityCodeGroups = async (
  params: HealthFacilityCodeGroupQueryDto,
): Promise<PaginationModel<HealthFacilityCodeGroupModel>> => {
  const orderBy: Prisma.HealthFacilityCodeGroupOrderByWithRelationInput[] = [{ id: SortOrder.asc }]
  const entities = await prisma.healthFacilityCodeGroup.paginate({
    where: { id: params.id, name: { contains: params.name }, existence: true },
    orderBy: orderBy,
    pageNo: params.pageNo,
    pageSize: params.pageSize,
  })
  return entities as unknown as PaginationModel<HealthFacilityCodeGroupModel>
}

/**
 * 指定IDの施設コードグループ情報を取得します。
 * @param id 施設コードグループID
 * @return 施設コードグループ情報
 */
export const fetchHealthFacilityCodeGroup = async (id: string) => {
  return await prisma.healthFacilityCodeGroup.findUnique({
    where: { id: id, existence: true },
  })
}
