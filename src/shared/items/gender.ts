/** 性別 */
export const GENDER = {
  UNCERTAIN: '不明',
  MALE: '男性',
  FEMALE: '女性',
} as const

/** 性別Enum */
export type Gender = typeof GENDER
/** 性別キー */
export type GenderKey = keyof typeof GENDER
/** 性別値 */
export type GenderValue = (typeof GENDER)[keyof typeof GENDER]

/** 性別キーリスト */
export const GENDER_KEY_LIST = Object.keys(GENDER) as readonly GenderKey[]

/** 性別リスト */
export const GENDER_LIST = GENDER_KEY_LIST.map((key) => ({
  key: key,
  value: GENDER[key],
}))

/**
 * 性別キーから値を取得します。
 * @param key 性別キー
 * @param defaultValue 該当キーがない場合のデフォルト値
 * @return 性別値
 */
export const getGenderValue = (key: GenderKey | null | undefined, defaultValue: string = '') => {
  if (!key) return defaultValue
  if (key in GENDER) {
    return GENDER[key as GenderKey]
  }
  return defaultValue
}

/**
 * 性別値からキーを取得します。
 * @param value 性別値
 * @return 性別値。該当key情報がない場合はundefined
 */
export const getGenderKey = (value: GenderValue | string): GenderKey | undefined => {
  const keys = Object.keys(GENDER) as GenderKey[]
  return keys.find((key) => GENDER[key] === value)
}
