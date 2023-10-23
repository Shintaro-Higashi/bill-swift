/**
 * 患者変更方法Enum関連リストです。
 */

/** 変更方法 */
export const PATIENT_CHANGE_TYPE = {
  MANUAL: '手動変更',
  RECEIPT_SYNC: 'レセコン同期変更',
} as const

/** 変更方法Enum */
export type PatientChangeType = typeof PATIENT_CHANGE_TYPE
/** 変更方法キー */
export type PatientChangeTypeKey = keyof typeof PATIENT_CHANGE_TYPE
/** 変更方法値 */
export type PatientChangeTypeValue = (typeof PATIENT_CHANGE_TYPE)[keyof typeof PATIENT_CHANGE_TYPE]

/** 変更方法キーリスト */
export const PATIENT_CHANGE_TYPE_KEY_LIST = Object.keys(PATIENT_CHANGE_TYPE) as readonly PatientChangeTypeKey[]

/** 変更方法リスト */
export const PATIENT_CHANGE_TYPE_LIST = PATIENT_CHANGE_TYPE_KEY_LIST.map((key) => ({
  key: key,
  value: PATIENT_CHANGE_TYPE[key],
}))

/**
 * 変更方法キーから値を取得します。
 * @param key 変更方法キー
 * @param defaultValue 該当キーがない場合のデフォルト値
 * @return 変更方法値
 */
export const getPatientChangeTypeValue = (key: PatientChangeTypeKey | null | undefined, defaultValue: string = '') => {
  if (!key) return defaultValue
  if (key in PATIENT_CHANGE_TYPE) {
    return PATIENT_CHANGE_TYPE[key as PatientChangeTypeKey]
  }
  return defaultValue
}

/**
 * 変更方法値からキーを取得します。
 * @param value 変更方法値
 * @return 変更方法値。該当key情報がない場合はundefined
 */
export const getPatientChangeTypeKey = (value: PatientChangeTypeValue | string): PatientChangeTypeKey | undefined => {
  const keys = Object.keys(PATIENT_CHANGE_TYPE) as PatientChangeTypeKey[]
  return keys.find((key) => PATIENT_CHANGE_TYPE[key] === value)
}
