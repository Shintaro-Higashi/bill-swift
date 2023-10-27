import { isPast } from 'date-fns'
import { PatientModel, PatientRelateHealthFacilityModel } from '@/types'
import { PatientHealthFacilityChangeReasonKey } from '@/shared/items/patientHealthFacilityChangeReason'
import { PatientStatus } from '@prisma/client'

/**
 * 患者関連施設変更理由が退出(逝去、および退去)かを判定します。
 *
 */
export const iChangeHealthFacilityDeceaseExitReason = (
  reason: PatientHealthFacilityChangeReasonKey | null | undefined,
) => {
  return reason === 'DECEASE' || reason === 'EXIT'
}

/**
 * 患者関連施設変更理由から患者ステータスに変換します。
 *
 * @param reason
 */
export const toPatientStatusByHealthFacilityReason = (
  reason: PatientHealthFacilityChangeReasonKey | null | undefined,
): PatientStatus => {
  if (reason === 'CHANGE_PHARMACY' || reason === 'RELOCATION') throw new Error('患者ステータスに変更できないReasonEnum')
  if (!reason) return 'INRESIDENCE'
  return reason
}

/**
 * 患者関連施設Listから施設情報の変更予定があるかを判定します。
 * @param records 患者関連施設情報(複数指定時は先頭1件の情報から判断します)
 */
export const isFutureChangedPatientHealthFacility = (
  records: PatientRelateHealthFacilityModel[] | PatientRelateHealthFacilityModel | undefined,
) => {
  if (!records) return false
  const latestPatientHealthFacility = Array.isArray(records) ? records[0] : records
  // 施設変更予定
  if (!latestPatientHealthFacility.reason && !isPast(latestPatientHealthFacility.startDate)) {
    return true
  }
  // 退去予定
  if (
    iChangeHealthFacilityDeceaseExitReason(latestPatientHealthFacility.reason) &&
    !isPast(latestPatientHealthFacility.endDate)
  ) {
    return true
  }
  return false
}
