import depend from '@/core/utils/velona'
import { prisma } from '@/servers/repositories/prisma/configs/prisma'
import { Prisma } from '.prisma/client'
import SortOrder = Prisma.SortOrder
import { getCurrentDate } from '@/core/utils/dateUtil'
import { getAuthorizedUserId } from '@/core/utils/requestUtil'
import { createId } from '@paralleldrive/cuid2'
import { PatientHealthFacilityEditingDto } from '@/types'

/**
 * 指定の患者IDに該当する患者関連施設情報を最新順に取得します。
 * @param patientId 患者ID
 * @param healthFacilityId 施設ID
 * @return 患者情報
 */
export const fetchPatientRelateHealthFacilitiesByPatientId = depend(
  { client: prisma },
  async ({ client }, patientId: string) => {
    return await client.patientRelateHealthFacility.findMany({
      where: { patientId, existence: true },
      orderBy: { id: SortOrder.desc },
    })
  },
)

/**
 * 指定の患者IDと施設IDに該当する患者関連施設情報を取得します。
 * @param patientId 患者ID
 * @param healthFacilityId 施設ID
 * @return 患者情報
 */
export const fetchPatientRelateHealthFacilityByPatient = depend(
  { client: prisma },
  async ({ client }, patientId: string, healthFacilityId: string) => {
    return await client.patientRelateHealthFacility.findFirstOrThrow({
      where: { patientId, healthFacilityId, existence: true },
    })
  },
)

/**
 * 患者関連施設を作成します。
 * @param params
 */
export const createPatientRelateHealthFacility = depend(
  { client: prisma },
  async ({ client }, params: PatientHealthFacilityEditingDto) => {
    const now = getCurrentDate()
    const userId = getAuthorizedUserId()
    if (!params.patientId || !params.healthFacilityId || !params.startDate) {
      throw new Error('患者IDまたは施設IDが未設定です')
    }

    return await client.patientRelateHealthFacility.create({
      data: {
        id: createId(),
        ...params,
        patientId: params.patientId,
        healthFacilityId: params.healthFacilityId,
        startDate: params.startDate,
        endDate: new Date('2100/12/31'),
        createdBy: userId,
        updatedBy: userId,
        createdAt: now,
        updatedAt: now,
      },
    })
  },
)

/**
 * 指定の患者関連施設情報を更新します。
 * @param id 患者関連施設ID
 * @param params 患者関連施設情報
 */
export const updatePatientRelateHealthFacility = depend(
  { client: prisma },
  async ({ client }, id: string, params: PatientHealthFacilityEditingDto) => {
    const now = getCurrentDate()
    return await client.patientRelateHealthFacility.update({
      data: {
        ...params,
        updatedBy: getAuthorizedUserId(),
        updatedAt: now,
      },
      where: { id: id, existence: true },
    })
  },
)
