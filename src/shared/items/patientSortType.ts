/** 患者ソート順 */
export const PATIENT_SORT_TYPE = {
  NAME: '名前順',
  CODE: '患者コード順',
  OTHER: 'その他',
} as const

/** 患者ソート順Enum */
export type PatientSortType = typeof PATIENT_SORT_TYPE
/** 患者ソート順キー */
export type PatientSortTypeKey = keyof typeof PATIENT_SORT_TYPE
/** 患者ソート順値 */
export type PatientSortTypeValue = (typeof PATIENT_SORT_TYPE)[keyof typeof PATIENT_SORT_TYPE]

/** 患者ソート順キーリスト */
export const PATIENT_SORT_TYPE_KEY_LIST = Object.keys(PATIENT_SORT_TYPE) as readonly PatientSortTypeKey[]

/** 患者ソート順リスト */
export const PATIENT_SORT_TYPE_LIST = PATIENT_SORT_TYPE_KEY_LIST.map((key) => ({
  key: key,
  value: PATIENT_SORT_TYPE[key],
}))

/**
 * 患者ソート順キーから値を取得します。
 * @param key 患者ソート順キー
 * @param defaultValue 該当キーがない場合のデフォルト値
 * @return 患者ソート順値
 */
export const getPatientSortTypeValue = (key: PatientSortTypeKey | null | undefined, defaultValue: string = '') => {
  if (!key) return defaultValue
  if (key in PATIENT_SORT_TYPE) {
    return PATIENT_SORT_TYPE[key as PatientSortTypeKey]
  }
  return defaultValue
}

/**
 * 患者ソート順値からキーを取得します。
 * @param value 患者ソート順値
 * @return 患者ソート順値。該当key情報がない場合はundefined
 */
export const getPatientSortTypeKey = (value: PatientSortTypeValue | string): PatientSortTypeKey | undefined => {
  const keys = Object.keys(PATIENT_SORT_TYPE) as PatientSortTypeKey[]
  return keys.find((key) => PATIENT_SORT_TYPE[key] === value)
}
