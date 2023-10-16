/** 医療/介護負担割合 */
export const MEDICAL_NURSING_SHARE = {
  ONE: '1割',
  TWO: '2割',
  THREE: '3割',
  NONE: '負担なし',
} as const

/** 医療/介護負担割合Enum */
export type MedicalNursingShare = typeof MEDICAL_NURSING_SHARE
/** 医療/介護負担割合キー */
export type MedicalNursingShareKey = keyof typeof MEDICAL_NURSING_SHARE
/** 医療/介護負担割合値 */
export type MedicalNursingShareValue = (typeof MEDICAL_NURSING_SHARE)[keyof typeof MEDICAL_NURSING_SHARE]

/** 医療/介護負担割合キーリスト */
export const MEDICAL_NURSING_SHARE_KEY_LIST = Object.keys(MEDICAL_NURSING_SHARE) as readonly MedicalNursingShareKey[]

/** 医療/介護負担割合リスト */
export const MEDICAL_NURSING_SHARE_LIST = MEDICAL_NURSING_SHARE_KEY_LIST.map((key) => ({
  key: key,
  value: MEDICAL_NURSING_SHARE[key],
}))

/**
 * 医療/介護負担割合キーから値を取得します。
 * @param key 医療/介護負担割合キー
 * @param defaultValue 該当キーがない場合のデフォルト値
 * @return 医療/介護負担割合値
 */
export const getMedicalNursingShareValue = (
  key: MedicalNursingShareKey | null | undefined,
  defaultValue: string = '',
) => {
  if (!key) return defaultValue
  if (key in MEDICAL_NURSING_SHARE) {
    return MEDICAL_NURSING_SHARE[key as MedicalNursingShareKey]
  }
  return defaultValue
}

/**
 * 医療/介護負担割合値からキーを取得します。
 * @param value 医療/介護負担割合値
 * @return 医療/介護負担割合値。該当key情報がない場合はundefined
 */
export const getMedicalNursingShareKey = (
  value: MedicalNursingShareValue | string,
): MedicalNursingShareKey | undefined => {
  const keys = Object.keys(MEDICAL_NURSING_SHARE) as MedicalNursingShareKey[]
  return keys.find((key) => MEDICAL_NURSING_SHARE[key] === value)
}
