import depend from '@/core/utils/velona'
import { prisma } from '@/servers/repositories/prisma/configs/prisma'
import { Prisma } from '.prisma/client'
import SortOrder = Prisma.SortOrder
import { getCurrentDate, getEndMaxDate, toJSTDate } from '@/core/utils/dateUtil'
import { getAuthorizedUserId } from '@/core/utils/requestUtil'
import { createId } from '@paralleldrive/cuid2'
import { PatientHealthFacilityEditingDto, PatientRelateHealthFacilityModel } from '@/types'
import { PatientRelateHealthFacilityReason, PatientStatus } from '@prisma/client'

/**
 * 指定のIDに該当する患者関連施設情報を取得します。
 * @param id 患者関連施設ID
 * @return 患者関連施設情報
 */
export const fetchPatientRelateHealthFacility = depend({ client: prisma }, async ({ client }, id: string) => {
  return await client.patientRelateHealthFacility.findUniqueOrThrow({
    select: {
      id: true,
      healthFacilityId: true,
      patientId: true,
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
    where: { id, existence: true },
  })
})

/**
 * 指定の患者IDに該当する患者関連施設情報を最新順に取得します。
 * @param patientId 患者ID
 * @param healthFacilityId 施設ID
 * @return 患者関連施設情報
 */
export const fetchPatientRelateHealthFacilitiesByPatientId = depend(
  { client: prisma },
  async ({ client }, patientId: string) => {
    return await client.patientRelateHealthFacility.findMany({
      select: {
        id: true,
        healthFacilityId: true,
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
 * @return 患者関連施設情報
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
 * 患者の所属施設の切り替えが必要な患者関連施設情報を取得します。
 * <pre>
 *  入居予定日が過ぎているが、まだ該当の施設及び患者番号になっていない患者の関連施設を対象に取得します。
 * </pre>
 * @param lessThanDate 処理が必須の判定規準日(基本現在日時を指定。指定日以下の入居日を対象)
 */
export const fetchRequiredAffiliationChangeFacilities = depend(
  { client: prisma },
  async ({ client }, lessThanDate: Date) => {
    console.log('lessThanDate', lessThanDate)
    return await client.$queryRaw<PatientRelateHealthFacilityModel[]>`
        SELECT
              patient_relate_health_facility.id                  id         
            , patient_relate_health_facility.patient_id          patientId
            , patient_relate_health_facility.health_facility_id  healthFacilityId
            , patient_code        patientCode
            , start_date          startDate
            , end_date            endDate
            , bill_sort           billSort
            , reason              reason
        FROM
            patient_relate_health_facility
                JOIN patient ON (
                patient.id = patient_relate_health_facility.patient_id
                )
        WHERE
            reason IS NULL
          AND start_date < ${lessThanDate}
          AND NOT EXISTS (
            SELECT
                *
            FROM
                patient
            WHERE
                patient.id = patient_relate_health_facility.patient_id
              AND patient.health_facility_id = patient_relate_health_facility.health_facility_id
              AND patient.code = patient_relate_health_facility.patient_code
        )
        ORDER BY
            created_at`
  },
)

/**
 * 逝去、または退去に患者ステータスの切り替えが必要な患者関連施設情報を取得します。
 * <pre>
 *  退出予定日が過ぎているが、まだ退去、退出ステータスになっていない患者の関連施設を対象に取得します。
 * </pre>
 * @param lessThanDate 処理が必須の判定規準日(基本現在日時を指定。指定日以下の退出日を対象)
 */
export const fetchRequiredChangeStatusPatientRelateHealthFacilities = depend(
  { client: prisma },
  async ({ client }, lessThanDate: Date) => {
    return await client.$queryRaw<PatientRelateHealthFacilityModel[]>`
      SELECT
           *
       FROM
           patient_relate_health_facility
       WHERE
           reason IN (${PatientRelateHealthFacilityReason.DECEASE}, ${PatientRelateHealthFacilityReason.EXIT})
         AND end_date < ${lessThanDate}
         AND EXISTS (
           SELECT
               *
           FROM
               patient
           where
               patient.id = patient_relate_health_facility.patient_id
             AND patient.health_facility_id = patient_relate_health_facility.health_facility_id
             AND patient.code = patient_relate_health_facility.patient_code
             AND patient.status = ${PatientStatus.INRESIDENCE}
       )
       ORDER BY
           created_at`
  },
)
/**
 * 患者関連施設を作成します。
 * @param params 患者関連施設情報
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
        endDate: getEndMaxDate(),
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
        patientId: params.patientId,
        healthFacilityId: params.healthFacilityId,
        patientCode: params.patientCode,
        startDate: params.startDate,
        endDate: params.endDate,
        reason: params.reason,
        note: params.note,
        updatedBy: getAuthorizedUserId(),
        updatedAt: now,
      },
      where: { id: id, existence: true },
    })
  },
)

/**
 * 指定の患者関連施設情報を物理削除します。
 * @param id 患者関連施設ID
 */
export const deletePatientRelateHealthFacility = depend({ client: prisma }, async ({ client }, id: string) => {
  return await client.patientRelateHealthFacility.delete({
    where: { id: id },
  })
})
