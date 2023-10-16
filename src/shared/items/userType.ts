/** ユーザアカウント種別 */
export const USER_TYPE = {
  ADMIN: '管理者',
  STAFF: '業務課',
  PHARMACY: '店舗',
  PATIENT: '患者',
} as const

/** ユーザアカウント種別Enum */
export type UserType = typeof USER_TYPE
/** ユーザアカウント種別キー */
export type UserTypeKey = keyof typeof USER_TYPE
/** ユーザアカウント種別値 */
export type UserTypeValue = (typeof USER_TYPE)[keyof typeof USER_TYPE]

/** ユーザアカウント種別キーリスト */
export const USER_TYPE_KEY_LIST = Object.keys(USER_TYPE) as readonly UserTypeKey[]

/** ユーザアカウント種別リスト */
export const USER_TYPE_LIST = USER_TYPE_KEY_LIST.map((key) => ({
  key: key,
  value: USER_TYPE[key],
}))

/**
 * ユーザアカウント種別キーから値を取得します。
 * @param key ユーザアカウント種別キー
 * @param defaultValue 該当キーがない場合のデフォルト値
 * @return ユーザアカウント種別値
 */
export const getUserTypeValue = (key: UserTypeKey, defaultValue: string = '') => {
  if (key in USER_TYPE) {
    return USER_TYPE[key as UserTypeKey]
  }
  return defaultValue
}

/**
 * ユーザアカウント種別値からキーを取得します。
 * @param value ユーザアカウント種別値
 * @return ユーザアカウント種別値。該当key情報がない場合はundefined
 */
export const getUserTypeKey = (value: UserTypeValue | string): UserTypeKey | undefined => {
  const keys = Object.keys(USER_TYPE) as UserTypeKey[]
  return keys.find((key) => USER_TYPE[key] === value)
}
