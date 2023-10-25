/** 患者ステータス */
export const PATIENT_STATUS = {
  INRESIDENCE: '入居中',
  DECEASE: '逝去',
  EXIT: '退去',
} as const

/** 患者ステータスEnum */
export type PatientStatus = typeof PATIENT_STATUS
/** 患者ステータスキー */
export type PatientStatusKey = keyof typeof PATIENT_STATUS
/** 患者ステータス値 */
export type PatientStatusValue = (typeof PATIENT_STATUS)[keyof typeof PATIENT_STATUS]

/** 患者ステータスキーリスト */
export const PATIENT_STATUS_KEY_LIST = Object.keys(PATIENT_STATUS) as readonly PatientStatusKey[]

/** 患者ステータスリスト */
export const PATIENT_STATUS_LIST = PATIENT_STATUS_KEY_LIST.map((key) => ({
  key: key,
  value: PATIENT_STATUS[key],
}))

/**
 * 患者ステータスキーから値を取得します。
 * @param key 患者ステータスキー
 * @param defaultValue 該当キーがない場合のデフォルト値
 * @return 患者ステータス値
 */
export const getPatientStatusValue = (key: PatientStatusKey | null | undefined, defaultValue: string = '') => {
  if (!key) return defaultValue
  if (key in PATIENT_STATUS) {
    return PATIENT_STATUS[key as PatientStatusKey]
  }
  return defaultValue
}

/**
 * 患者ステータス値からキーを取得します。
 * @param value 患者ステータス値
 * @return 患者ステータス値。該当key情報がない場合はundefined
 */
export const getPatientStatusKey = (value: PatientStatusValue | string): PatientStatusKey | undefined => {
  const keys = Object.keys(PATIENT_STATUS) as PatientStatusKey[]
  return keys.find((key) => PATIENT_STATUS[key] === value)
}
