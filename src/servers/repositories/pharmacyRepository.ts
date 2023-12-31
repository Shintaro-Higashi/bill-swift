import { PharmacyCreationDto, PharmacyEditingDto, PharmacyModel, PharmacyQueryDto, PaginationModel } from '@/types'
import { Prisma } from '.prisma/client'
import { prisma } from '@/servers/repositories/prisma/configs/prisma'
import { getCurrentDate } from '@/core/utils/dateUtil'
import { createId } from '@paralleldrive/cuid2'
import depend from '@/core/utils/velona'
import SortOrder = Prisma.SortOrder
import { getAuthorizedUserId } from '@/core/utils/requestUtil'
import IntegrityDeletedError from '@/servers/core/errors/integrityDeletedError'

/**
 * 店舗のページング検索を実施します。
 * @param params 検索条件
 * @return 検索結果
 */
export const fetchPagedPharmacies = async (params: PharmacyQueryDto): Promise<PaginationModel<PharmacyModel>> => {
  const orderBy: Prisma.PharmacyOrderByWithRelationInput[] = [{ id: SortOrder.asc }]
  if (params.sort && params.order) {
    if (params.sort === 'name') {
      orderBy.unshift(
        { pharmacyGroup: { nameKana: params.order } },
        {
          nameKana: params.order,
        },
      )
    } else {
      orderBy.unshift({ [params.sort]: params.order })
    }
  }

  const entities = await prisma.pharmacy.paginate({
    where: {
      company: { id: params.companyId },
      pharmacyGroup: { id: params.pharmacyGroupId },
      ...(params.name !== undefined
        ? { OR: [{ name: { contains: params.name } }, { nameKana: { contains: params.name } }] }
        : {}),
      existence: true,
    },
    include: {
      pharmacyGroup: true,
      transferAccountManage: true,
      withdrawalAccountManage: true,
      createdUser: true,
      updatedUser: true,
    },
    orderBy: orderBy,
    pageNo: params.pageNo,
    pageSize: params.pageSize,
  })
  return entities as unknown as PaginationModel<PharmacyModel>
}

/**
 * 指定IDの店舗情報を取得します。
 * @param id 店舗ID
 * @return 店舗情報
 */
export const fetchPharmacy = async (id: string) => {
  return await prisma.pharmacy.findUniqueOrThrow({
    where: { id: id, existence: true },
    include: {
      company: true,
      pharmacyGroup: true,
      transferAccountManage: true,
      withdrawalAccountManage: true,
      createdUser: true,
      updatedUser: true,
    },
  })
}

/**
 * 店舗を作成します。
 * @param params
 */
export const createPharmacy = depend({ client: prisma }, async ({ client }, params: PharmacyCreationDto) => {
  const now = getCurrentDate()
  const userId = getAuthorizedUserId()
  return await client.pharmacy.create({
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
 * 指定の店舗情報を更新します。
 * @param id 店舗ID
 * @param params 店舗情報
 */
export const updatePharmacy = depend({ client: prisma }, async ({ client }, id: string, params: PharmacyEditingDto) => {
  const now = getCurrentDate()
  return await client.pharmacy.update({
    data: {
      ...params,
      updatedBy: getAuthorizedUserId(),
      updatedAt: now,
    },
    where: { id: id, existence: true },
  })
})

/**
 * 指定の店舗情報を論理削除します。
 * @param id 店舗ID
 * @throws IntegrityDeletedError 使用中の所属施設が存在する場合
 */
export const archivePharmacy = depend({ client: prisma }, async ({ client }, id: string) => {
  const now = getCurrentDate()
  const archiveData = await client.pharmacy.update({
    data: {
      updatedBy: getAuthorizedUserId(),
      deletedAt: now,
    },
    where: { id: id, deletedAt: null },
  })
  const existsRelateHealthFacility = await client.healthFacilityRelatePharmacy.findFirst({
    where: { pharmacyId: id, existence: true },
  })
  if (existsRelateHealthFacility) throw new IntegrityDeletedError()
  return archiveData
})
