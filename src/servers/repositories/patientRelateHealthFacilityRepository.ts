import depend from '@/core/utils/velona'
import { prisma } from '@/servers/repositories/prisma/configs/prisma'
import { $Enums, Prisma } from '.prisma/client'
import SortOrder = Prisma.SortOrder
import { getCurrentDate, getEndMaxDate, toJSTDate } from '@/core/utils/dateUtil'
import { getAuthorizedUserId } from '@/core/utils/requestUtil'
import { createId } from '@paralleldrive/cuid2'
import { PatientHealthFacilityEditingDto, PatientRelateHealthFacilityModel } from '@/types'
import { PatientRelateHealthFacilityReason, PatientStatus } from '@prisma/client'
import { undefined } from 'zod'

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
 * 指定の患者IDに該当する患者関連施設情報を入居(予定)日最新順に取得します。
 * @param patientId 患者ID
 * @param healthFacilityId 施設ID
 * @return 患者関連施設情報
 */
export const fetchPatientRelateHealthFacilitiesByPatientId = depend(
  { client: prisma },
  async ({ client }, patientId: string) => {
    return (await client.patientRelateHealthFacility.findMany({
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
    })) as unknown as PatientRelateHealthFacilityModel[]
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
    const resultList = await client.$queryRaw`
        SELECT
            /** relate_health_facility */
              patient_relate_health_facility.id     
            , patient_id 
            , patient_relate_health_facility.health_facility_id
            , patient_code        
            , start_date          
            , end_date            
            , bill_sort           
            , reason
            /** patient */
            ,patient.health_facility_id    patient_health_facility_id
            ,status                        patient_status
            ,name                          patient_name
            ,name_kana                     patient_name_kana
            ,search_name                   patient_search_name
            ,gender                        patient_gender
            ,birthday                      patient_birthday
            ,bill_enable_flag              patient_bill_enable_flag
            ,medical_insurance_status      patient_medical_insurance_status
            ,medical_insurance_start_date  patient_medical_insurance_start_date
            ,medical_insurance_end_date    patient_medical_insurance_end_date
            ,medical_share_confirm_date    patient_medical_share_confirm_date
            ,medical_share                 patient_medical_share
            ,nursing_insurance_status      patient_nursing_insurance_status
            ,nursing_insurance_start_date  patient_nursing_insurance_start_date
            ,nursing_insurance_end_date    patient_nursing_insurance_end_date
            ,nursing_share_confirm_date    patient_nursing_share_confirm_date
            ,nursing_share                 patient_nursing_share
            ,public_expense                patient_public_expense
            ,consent_status                patient_consent_status
            ,consent_confirm_date          patient_consent_confirm_date
            ,payment_type                  patient_payment_type
            ,account_confirm_status        patient_account_confirm_status
            ,account_manage_id             patient_account_manage_id
            ,receipt_sync_flag             patient_receipt_sync_flag
            ,delivery_name                 patient_delivery_name
            ,delivery_postal_code          patient_delivery_postal_code
            ,delivery_address1             patient_delivery_address1
            ,delivery_address2             patient_delivery_address2
            ,delivery_tel                  patient_delivery_tel
            ,health_facility_info          patient_health_facility_info
            ,patient.note                  patient_note
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
            patient_relate_health_facility.created_at`

    const entities = resultList as unknown as any[]
    const modelList: PatientRelateHealthFacilityModel[] = toModelListForQueryRaw(entities)

    return modelList
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
    const resultList = await client.$queryRaw<PatientRelateHealthFacilityModel[]>`
      SELECT
          /** relate_health_facility */
          patient_relate_health_facility.id
           , patient_id
           , patient_relate_health_facility.health_facility_id
           , patient_code
           , start_date
           , end_date
           , bill_sort
           , reason
          /** patient */
           ,patient.health_facility_id    patient_health_facility_id
           ,status                        patient_status
           ,name                          patient_name
           ,name_kana                     patient_name_kana
           ,search_name                   patient_search_name
           ,gender                        patient_gender
           ,birthday                      patient_birthday
           ,bill_enable_flag              patient_bill_enable_flag
           ,medical_insurance_status      patient_medical_insurance_status
           ,medical_insurance_start_date  patient_medical_insurance_start_date
           ,medical_insurance_end_date    patient_medical_insurance_end_date
           ,medical_share_confirm_date    patient_medical_share_confirm_date
           ,medical_share                 patient_medical_share
           ,nursing_insurance_status      patient_nursing_insurance_status
           ,nursing_insurance_start_date  patient_nursing_insurance_start_date
           ,nursing_insurance_end_date    patient_nursing_insurance_end_date
           ,nursing_share_confirm_date    patient_nursing_share_confirm_date
           ,nursing_share                 patient_nursing_share
           ,public_expense                patient_public_expense
           ,consent_status                patient_consent_status
           ,consent_confirm_date          patient_consent_confirm_date
           ,payment_type                  patient_payment_type
           ,account_confirm_status        patient_account_confirm_status
           ,account_manage_id             patient_account_manage_id
           ,receipt_sync_flag             patient_receipt_sync_flag
           ,delivery_name                 patient_delivery_name
           ,delivery_postal_code          patient_delivery_postal_code
           ,delivery_address1             patient_delivery_address1
           ,delivery_address2             patient_delivery_address2
           ,delivery_tel                  patient_delivery_tel
           ,health_facility_info          patient_health_facility_info
           ,patient.note                  patient_note
       FROM
           patient_relate_health_facility
               JOIN patient ON (
                patient.id = patient_relate_health_facility.patient_id
               )
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
          patient_relate_health_facility.created_at`

    const entities = resultList as unknown as any[]
    const modelList: PatientRelateHealthFacilityModel[] = toModelListForQueryRaw(entities)

    return modelList
  },
)

const toModelListForQueryRaw = (entities: any[]) => {
  const modelList: PatientRelateHealthFacilityModel[] = []
  entities.forEach((record: any) => {
    modelList.push({
      id: record.id,
      patientId: record['patient_id'],
      healthFacilityId: record['health_facility_id'],
      patientCode: record['patient_code'],
      startDate: record['start_date'],
      endDate: record['end_date'],
      billSort: record['bill_sort'],
      reason: record['reason'],
      note: record['id'],
      createdAt: null,
      createdBy: null,
      deletedAt: null,
      updatedAt: null,
      updatedBy: null,
      existence: true,
      patient: {
        id: record['patient_id'],
        healthFacilityId: record['patient_health_facility_id'],
        code: record['patient_code'],
        status: record['patient_status'],
        name: record['patient_name'],
        nameKana: record['patient_name_kana'],
        searchName: record['patient_search_name'],
        gender: record['patient_gender'],
        birthday: record['patient_birthday'],
        billEnableFlag: toBooleanColumn(record['patient_bill_enable_flag']) ?? false,
        medicalInsuranceStatus: record['patient_medical_insurance_status'],
        medicalInsuranceStartDate: record['patient_medical_insurance_start_date'],
        medicalInsuranceEndDate: record['patient_medical_insurance_end_date'],
        medicalShareConfirmDate: record['patient_medical_share_confirm_date'],
        medicalShare: record['patient_medical_share'],
        nursingInsuranceStatus: record['patient_nursing_insurance_status'],
        nursingInsuranceStartDate: record['patient_nursing_insurance_start_date'],
        nursingInsuranceEndDate: record['patient_nursing_insurance_end_date'],
        nursingShareConfirmDate: record['patient_nursing_share_confirm_date'],
        nursingShare: record['patient_nursing_share'],
        publicExpense: toBooleanColumn(record['patient_public_expense']),
        consentStatus: record['patient_consent_status'],
        consentConfirmDate: record['patient_consent_confirm_date'],
        paymentType: record['patient_payment_type'],
        accountConfirmStatus: record['patient_account_confirm_status'],
        accountManageId: record['patient_account_manage_id'],
        receiptSyncFlag: toBooleanColumn(record['patient_receipt_sync_flag']) ?? false,
        deliveryName: record['patient_delivery_name'],
        deliveryPostalCode: record['patient_delivery_postal_code'],
        deliveryAddress1: record['patient_delivery_address1'],
        deliveryAddress2: record['patient_delivery_address2'],
        deliveryTel: record['patient_delivery_tel'],
        healthFacilityInfo: record['patient_health_facility_info'],
        note: record['patient_note'],
        createdAt: record['patient_created_at'],
        createdBy: record['patient_created_by'],
        deletedAt: record['patient_deleted_at'],
        updatedAt: record['patient_updated_at'],
        updatedBy: record['patient_updated_by'],
        existence: true,
      },
    })
  })
  return modelList
}

// queryRaw結果がbool型が数値になるためboolに補正
const toBooleanColumn = (value: any) => {
  if (value == null) return null
  return !!value
}

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
