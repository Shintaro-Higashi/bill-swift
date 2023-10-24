/** 患者施設変更理由 */
export const PATIENT_HEALTH_FACILITY_CHANGE_REASON = {
  DECEASE: '逝去・退去',
  RELOCATION: '施設の変更',
} as const

/** 患者施設変更理由Enum */
export type PatientHealthFacilityChangeReason = typeof PATIENT_HEALTH_FACILITY_CHANGE_REASON
/** 患者施設変更理由キー */
export type PatientHealthFacilityChangeReasonKey = keyof typeof PATIENT_HEALTH_FACILITY_CHANGE_REASON
/** 患者施設変更理由値 */
export type PatientHealthFacilityChangeReasonValue =
  (typeof PATIENT_HEALTH_FACILITY_CHANGE_REASON)[keyof typeof PATIENT_HEALTH_FACILITY_CHANGE_REASON]

/** 患者施設変更理由キーリスト */
export const PATIENT_HEALTH_FACILITY_CHANGE_REASON_KEY_LIST = Object.keys(
  PATIENT_HEALTH_FACILITY_CHANGE_REASON,
) as readonly PatientHealthFacilityChangeReasonKey[]

/** 患者施設変更理由リスト */
export const PATIENT_HEALTH_FACILITY_CHANGE_REASON_LIST = PATIENT_HEALTH_FACILITY_CHANGE_REASON_KEY_LIST.map((key) => ({
  key: key,
  value: PATIENT_HEALTH_FACILITY_CHANGE_REASON[key],
}))

/**
 * 患者施設変更理由キーから値を取得します。
 * @param key 患者施設変更理由キー
 * @param defaultValue 該当キーがない場合のデフォルト値
 * @return 患者施設変更理由値
 */
export const getPatientHealthFacilityChangeReasonValue = (
  key: PatientHealthFacilityChangeReasonKey | null | undefined,
  defaultValue: string = '',
) => {
  if (!key) return defaultValue
  if (key in PATIENT_HEALTH_FACILITY_CHANGE_REASON) {
    return PATIENT_HEALTH_FACILITY_CHANGE_REASON[key as PatientHealthFacilityChangeReasonKey]
  }
  return defaultValue
}

/**
 * 患者施設変更理由値からキーを取得します。
 * @param value 患者施設変更理由値
 * @return 患者施設変更理由値。該当key情報がない場合はundefined
 */
export const getPatientHealthFacilityChangeReasonKey = (
  value: PatientHealthFacilityChangeReasonValue | string,
): PatientHealthFacilityChangeReasonKey | undefined => {
  const keys = Object.keys(PATIENT_HEALTH_FACILITY_CHANGE_REASON) as PatientHealthFacilityChangeReasonKey[]
  return keys.find((key) => PATIENT_HEALTH_FACILITY_CHANGE_REASON[key] === value)
}
