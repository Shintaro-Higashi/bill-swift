/** 同意書ステータス */
export const CONSENT_STATUS = {
  UNSIGNED: '未契約',
  UNCOLLECTED: '未回収',
  COLLECTED: '回収済',
  OTHER: 'その他',
} as const

/** 同意書ステータスEnum */
export type ConsentStatus = typeof CONSENT_STATUS
/** 同意書ステータスキー */
export type ConsentStatusKey = keyof typeof CONSENT_STATUS
/** 同意書ステータス値 */
export type ConsentStatusValue = (typeof CONSENT_STATUS)[keyof typeof CONSENT_STATUS]

/** 同意書ステータスキーリスト */
export const CONSENT_STATUS_KEY_LIST = Object.keys(CONSENT_STATUS) as readonly ConsentStatusKey[]

/** 同意書ステータスリスト */
export const CONSENT_STATUS_LIST = CONSENT_STATUS_KEY_LIST.map((key) => ({
  key: key,
  value: CONSENT_STATUS[key],
}))

/**
 * 同意書ステータスキーから値を取得します。
 * @param key 同意書ステータスキー
 * @param defaultValue 該当キーがない場合のデフォルト値
 * @return 同意書ステータス値
 */
export const getConsentStatusValue = (key: ConsentStatusKey | null | undefined, defaultValue: string = '') => {
  if (!key) return defaultValue
  if (key in CONSENT_STATUS) {
    return CONSENT_STATUS[key as ConsentStatusKey]
  }
  return defaultValue
}

/**
 * 同意書ステータス値からキーを取得します。
 * @param value 同意書ステータス値
 * @return 同意書ステータス値。該当key情報がない場合はundefined
 */
export const getConsentStatusKey = (value: ConsentStatusValue | string): ConsentStatusKey | undefined => {
  const keys = Object.keys(CONSENT_STATUS) as ConsentStatusKey[]
  return keys.find((key) => CONSENT_STATUS[key] === value)
}
