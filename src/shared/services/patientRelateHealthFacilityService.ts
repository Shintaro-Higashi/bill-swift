import { isPast } from 'date-fns'
import { PatientModel, PatientRelateHealthFacilityModel } from '@/types'

/**
 * 患者関連施設がまだ予定状態であるかを判定します。
 * @param patient 患者情報
 * @param patientRelateHealthFacility 患者関連施設
 */
export const isFuturePatientRelateHealthFacility = (
  patient: PatientModel,
  patientRelateHealthFacility: PatientRelateHealthFacilityModel,
) => {
  // 既に適用済
  if (
    patientRelateHealthFacility.patientCode === patient.code &&
    patientRelateHealthFacility.healthFacilityId === patient.healthFacilityId
  ) {
    return false
  }
  // 適用前の施設変更
  if (!isPast(patientRelateHealthFacility.startDate) && !patientRelateHealthFacility.reason) {
    return true
  }
  // 退出予定
  if (
    patientRelateHealthFacility.reason === 'DECEASE' ||
    (patientRelateHealthFacility.reason === 'EXIT' && !isPast(patientRelateHealthFacility.endDate))
  ) {
    return true
  }

  return false
}
