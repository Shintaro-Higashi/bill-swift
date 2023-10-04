/** 口座種別 */
export const ACCOUNT_TYPE = {
  '0': '普通',
  '1': '当座',
} as const

/** 口座種別Enum */
export type AccountType = typeof ACCOUNT_TYPE
/** 口座種別キー */
export type AccountTypeKey = keyof typeof ACCOUNT_TYPE
/** 口座種別値 */
export type AccountTypeValue = (typeof ACCOUNT_TYPE)[keyof typeof ACCOUNT_TYPE]

/** 口座種別キーリスト */
export const ACCOUNT_TYPE_KEY_LIST = Object.keys(ACCOUNT_TYPE) as readonly AccountTypeKey[]

/** 口座種別リスト */
export const ACCOUNT_TYPE_LIST = ACCOUNT_TYPE_KEY_LIST.map((key) => ({
  key: key,
  value: ACCOUNT_TYPE[key],
}))

/**
 * 口座種別キーから値を取得します。
 * @param key 口座種別キー
 * @param defaultValue 該当キーがない場合のデフォルト値
 * @return 口座種別値
 */
export const getAccountTypeValue = (key: string | null | undefined, defaultValue: string = '') => {
  if (key && key in ACCOUNT_TYPE) {
    return ACCOUNT_TYPE[key as AccountTypeKey]
  }
  return defaultValue
}

/**
 * 口座種別値からキーを取得します。
 * @param value 口座種別値
 * @return 口座種別値。該当key情報がない場合はundefined
 */
export const getAccountTypeKey = (value: AccountTypeValue | string): AccountTypeKey | undefined => {
  const keys = Object.keys(ACCOUNT_TYPE) as AccountTypeKey[]
  return keys.find((key) => ACCOUNT_TYPE[key] === value)
}
