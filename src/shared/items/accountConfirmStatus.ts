/** 口座振替確認状態 */
export const ACCOUNT_CONFIRM_STATUS = {
  UNCOLLECTED: '未回収',
  AVAILABLE: '使用可',
  INVALID: '不備',
} as const

/** 口座振替確認状態Enum */
export type AccountConfirmStatus = typeof ACCOUNT_CONFIRM_STATUS
/** 口座振替確認状態キー */
export type AccountConfirmStatusKey = keyof typeof ACCOUNT_CONFIRM_STATUS
/** 口座振替確認状態値 */
export type AccountConfirmStatusValue = (typeof ACCOUNT_CONFIRM_STATUS)[keyof typeof ACCOUNT_CONFIRM_STATUS]

/** 口座振替確認状態キーリスト */
export const ACCOUNT_CONFIRM_STATUS_KEY_LIST = Object.keys(ACCOUNT_CONFIRM_STATUS) as readonly AccountConfirmStatusKey[]

/** 口座振替確認状態リスト */
export const ACCOUNT_CONFIRM_STATUS_LIST = ACCOUNT_CONFIRM_STATUS_KEY_LIST.map((key) => ({
  key: key,
  value: ACCOUNT_CONFIRM_STATUS[key],
}))

/**
 * 口座振替確認状態キーから値を取得します。
 * @param key 口座振替確認状態キー
 * @param defaultValue 該当キーがない場合のデフォルト値
 * @return 口座振替確認状態値
 */
export const getAccountConfirmStatusValue = (
  key: AccountConfirmStatusKey | null | undefined,
  defaultValue: string = '',
) => {
  if (!key) return defaultValue
  if (key in ACCOUNT_CONFIRM_STATUS) {
    return ACCOUNT_CONFIRM_STATUS[key as AccountConfirmStatusKey]
  }
  return defaultValue
}

/**
 * 口座振替確認状態値からキーを取得します。
 * @param value 口座振替確認状態値
 * @return 口座振替確認状態値。該当key情報がない場合はundefined
 */
export const getAccountConfirmStatusKey = (
  value: AccountConfirmStatusValue | string,
): AccountConfirmStatusKey | undefined => {
  const keys = Object.keys(ACCOUNT_CONFIRM_STATUS) as AccountConfirmStatusKey[]
  return keys.find((key) => ACCOUNT_CONFIRM_STATUS[key] === value)
}
