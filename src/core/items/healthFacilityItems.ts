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

const sortTypeKeys = Object.keys(PATIENT_SORT_TYPE) as PatientSortTypeKey[]
export const PATIENT_SORT_TYPE_LIST = sortTypeKeys.map((key) => ({
  key: key,
  value: PATIENT_SORT_TYPE[key],
}))
