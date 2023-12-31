import {
  HealthFacilityCreationDto,
  HealthFacilityEditingDto,
  HealthFacilityModel,
  HealthFacilityQueryDto,
  PaginationModel,
} from '@/types'
import { Prisma } from '.prisma/client'
import { prisma } from '@/servers/repositories/prisma/configs/prisma'
import depend from '@/core/utils/velona'
import { getCurrentDate } from '@/core/utils/dateUtil'
import { getAuthorizedUserId } from '@/core/utils/requestUtil'
import { createId } from '@paralleldrive/cuid2'
import SortOrder = Prisma.SortOrder
import IntegrityDeletedError from '../core/errors/integrityDeletedError'

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
  return await prisma.healthFacility.findUniqueOrThrow({
    where: { id: id, existence: true },
    include: {
      pharmacy: {
        include: {
          pharmacyGroup: { select: { name: true } },
          company: { select: { name: true, healthFacilityCodeGroupId: true } },
        },
      },
      healthFacilityRelatePharmacy: {
        include: { pharmacy: { include: { pharmacyGroup: { select: { name: true } } } }, accountManage: true },
        orderBy: { startDate: 'desc' },
      },
      accountManage: true,
      createdUser: true,
      updatedUser: true,
    },
  })
}

/**
 * 施設を作成します。
 * @param code
 * @param params
 */
export const createHealthFacility = depend(
  { client: prisma },
  async ({ client }, params: HealthFacilityCreationDto) => {
    const now = getCurrentDate()
    const userId = getAuthorizedUserId()
    const { startDate, code, searchName, ...healthFacilityParams } = params
    if (!code || !searchName) throw new Error('createHealthFacility ArgsError.code or searchName is undefined')
    return await client.healthFacility.create({
      data: {
        ...healthFacilityParams,
        id: createId(),
        code,
        searchName,
        createdBy: userId,
        updatedBy: userId,
        createdAt: now,
        updatedAt: now,
      },
    })
  },
)

/**
 * 施設作成時に必要な関連エンティティの情報を取得します。
 * @param params
 */
export const getRelatedEntitiesData = depend({ client: prisma }, async ({ client }, pharmacyId: string) => {
  return await client.pharmacy.findUnique({
    where: { id: pharmacyId, existence: true },
    include: {
      company: { include: { healthFacilityCodeGroup: true } },
      createdUser: true,
      updatedUser: true,
    },
  })
})

/**
 * 登録されたレコードから最大のコードを取得します（採番不可を除く）。
 * @param 採番不可コード配列
 */
export const getMaxCode = depend({ client: prisma }, async ({ client }, assignableCodes: string[]) => {
  return await client.healthFacility.findFirst({
    where: {
      code: {
        notIn: assignableCodes,
      },
    },
    orderBy: {
      code: 'desc',
    },
    select: {
      code: true,
    },
  })
})

/**
 * 指定の施設情報を更新します。
 * @param id 施設ID
 * @param params 施設情報
 */
export const updateHealthFacility = depend(
  { client: prisma },
  async ({ client }, id: string, params: HealthFacilityEditingDto) => {
    const now = getCurrentDate()
    const { startDate, ...healthFacilityParams } = params

    return await client.healthFacility.update({
      data: {
        ...healthFacilityParams,
        updatedBy: getAuthorizedUserId(),
        updatedAt: now,
      },
      where: { id: id, existence: true },
    })
  },
)

/**
 * 指定の施設情報を論理削除します。
 * @param id 施設ID
 * @throws IntegrityDeletedError 使用中の患者が存在する場合
 */
export const archiveHealthFacility = depend({ client: prisma }, async ({ client }, id: string) => {
  const now = getCurrentDate()
  const archiveData = await client.healthFacility.update({
    data: {
      updatedBy: getAuthorizedUserId(),
      deletedAt: now,
    },
    where: { id: id, deletedAt: null },
  })
  const existsPatient = await client.patient.findFirst({ where: { healthFacilityId: id, existence: true } })
  if (existsPatient) throw new IntegrityDeletedError()
  return archiveData
})
