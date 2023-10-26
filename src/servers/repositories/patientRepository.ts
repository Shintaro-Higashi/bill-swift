import { PaginationModel, PatientEditingDto, PatientModel, PatientQueryDto } from '@/types'
import { Prisma } from '.prisma/client'
import { prisma } from '@/servers/repositories/prisma/configs/prisma'
import SortOrder = Prisma.SortOrder
import depend from '@/core/utils/velona'
import { getCurrentDate } from '@/core/utils/dateUtil'
import { getAuthorizedUserId } from '@/core/utils/requestUtil'

/**
 * 患者のページング検索を実施します。
 * @param params 検索条件
 * @return 検索結果
 */
export const fetchPagedPatients = async (params: PatientQueryDto): Promise<PaginationModel<PatientModel>> => {
  const orderBy: Prisma.PatientOrderByWithRelationInput[] = [{ id: SortOrder.asc }]
  if (params.sort && params.order) {
    if (params.sort === 'name') {
      orderBy.unshift({ nameKana: params.order })
    } else {
      orderBy.unshift({ [params.sort]: params.order })
    }
  }

  const entities = await prisma.patient.paginate({
    where: {
      code: params.code,
      searchName: { contains: params.searchName },
      billEnableFlag: params.billDisableFlag === true ? false : undefined,
      // 過去所属も対象
      patientRelateHealthFacility: {
        some: {
          healthFacilityId: params.healthFacilityId,
          healthFacility: {
            pharmacyId: params.pharmacyId,
          },
        },
      },
      existence: true,
    },
    include: {
      healthFacility: {
        include: { pharmacy: { select: { name: true } } },
      },
      createdUser: true,
      updatedUser: true,
    },
    orderBy: orderBy,
    pageNo: params.pageNo,
    pageSize: params.pageSize,
  })
  return entities as unknown as PaginationModel<PatientModel>
}

/**
 * 指定IDの患者情報を取得します。
 * @param id 患者ID
 * @return 患者情報
 */
export const fetchPatient = depend({ client: prisma }, async ({ client }, id: string) => {
  return await client.patient.findUniqueOrThrow({
    where: { id: id, existence: true },
    include: {
      healthFacility: { select: { code: true, name: true, nameKana: true } },
      patientRelateHealthFacility: { include: { healthFacility: true } },
      patientFile: true,
      accountManage: { select: { name: true } },
      createdUser: true,
      updatedUser: true,
    },
  })
})

// /**
//  * 患者を作成します。
//  * @param params
//  */
// export const createPatient = depend({ client: prisma }, async ({ client }, params: PatientCreationDto) => {
//   const now = getCurrentDate()
//   const userId = getAuthorizedUserId()
//   return await client.patient.create({
//     data: {
//       id: createId(),
//       ...params,
//       createdBy: userId,
//       updatedBy: userId,
//       createdAt: now,
//       updatedAt: now,
//     },
//   })
// })

/**
 * 指定の患者情報を更新します。
 * @param id 患者ID
 * @param params 患者情報
 */
export const updatePatient = depend({ client: prisma }, async ({ client }, id: string, params: PatientEditingDto) => {
  const now = getCurrentDate()
  return await client.patient.update({
    data: {
      ...params,
      updatedBy: getAuthorizedUserId(),
      updatedAt: now,
    },
    where: { id: id, existence: true },
  })
})

// /**
//  * 指定の患者情報を論理削除します。
//  * @param id 患者ID
//  * @throws IntegrityDeletedError 使用中の所属薬局が存在する場合
//  */
// export const archivePatient = depend({ client: prisma }, async ({ client }, id: string) => {
//   const now = getCurrentDate()
//   const archiveData = await client.patient.update({
//     data: {
//       updatedBy: getAuthorizedUserId(),
//       deletedAt: now,
//     },
//     where: { id: id, deletedAt: null },
//   })
//   // TODO 削除条件を考える必要がある。逝去、退去した場合、間違えて作成した場合 など。バッチで削除などもありえる
//   const existsPharmacy = await client.pharmacy.findFirst({ where: { patientId: id, existence: true } })
//   if (existsPharmacy) throw new IntegrityDeletedError()
//   return archiveData
// })
