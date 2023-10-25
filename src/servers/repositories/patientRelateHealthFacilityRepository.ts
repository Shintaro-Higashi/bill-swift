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
      select: {
        id: true,
        patientCode: true,
        startDate: true,
        endDate: true,
        reason: true,
        note: true,
        healthFacility: {
          select: {
            name: true,
            nameKana: true,
            pharmacy: {
              select: { name: true, nameKana: true, pharmacyGroup: { select: { name: true, nameKana: true } } },
            },
          },
        },
        createdAt: true,
        createdUser: { select: { name: true } },
        updatedAt: true,
        updatedUser: { select: { name: true } },
      },
      where: { patientId, existence: true },
      orderBy: { createdAt: SortOrder.desc },
    })
  },
)

/**
 * 指定の患者ID、施設ID、患者コードに該当する患者関連施設情報を取得します。
 * <pre>
 *   患者ID、施設ID、患者コード で一意に情報を特定可能です。
 * </pre>
 * @param patientId 患者ID
 * @param healthFacilityId 施設ID
 * @param patientCode 患者コード
 * @return 患者情報
 */
export const fetchPatientRelateHealthFacilityByUnique = depend(
  { client: prisma },
  async ({ client }, patientId: string, healthFacilityId: string, patientCode: string) => {
    return await client.patientRelateHealthFacility.findUniqueOrThrow({
      where: {
        patientId_healthFacilityId_patientCode: {
          patientId,
          healthFacilityId,
          patientCode,
        },
        existence: true,
      },
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
    if (!params.patientId || !params.healthFacilityId || !params.startDate || !params.patientCode) {
      throw new Error('患者関連施設作成において必要なパラメータが未設定です')
    }

    return await client.patientRelateHealthFacility.create({
      data: {
        id: createId(),
        ...params,
        patientId: params.patientId,
        healthFacilityId: params.healthFacilityId,
        patientCode: params.patientCode,
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
