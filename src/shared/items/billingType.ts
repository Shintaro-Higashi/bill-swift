/** 請求種別 */
export const BILLING_TYPE = {
  BATCH: '一括請求',
  INDIVIDUAL: '個人請求',
  OTHER: 'その他',
} as const

/** 請求種別Enum */
export type BillingType = typeof BILLING_TYPE
/** 請求種別キー */
export type BillingTypeKey = keyof typeof BILLING_TYPE
/** 請求種別値 */
export type BillingTypeValue = (typeof BILLING_TYPE)[keyof typeof BILLING_TYPE]

/** 請求種別キーリスト */
export const BILLING_TYPE_KEY_LIST = Object.keys(BILLING_TYPE) as readonly BillingTypeKey[]

/** 請求種別リスト */
export const BILLING_TYPE_LIST = BILLING_TYPE_KEY_LIST.map((key) => ({
  key: key,
  value: BILLING_TYPE[key],
}))

/**
 * 請求種別キーから値を取得します。
 * @param key 請求種別キー
 * @param defaultValue 該当キーがない場合のデフォルト値
 * @return 請求種別値
 */
export const getBillingTypeValue = (key: BillingTypeKey, defaultValue: string = '') => {
  if (key in BILLING_TYPE) {
    return BILLING_TYPE[key as BillingTypeKey]
  }
  return defaultValue
}

/**
 * 請求種別値からキーを取得します。
 * @param value 請求種別値
 * @return 請求種別値。該当key情報がない場合はundefined
 */
export const getBillingTypeKey = (value: BillingTypeValue | string): BillingTypeKey | undefined => {
  const keys = Object.keys(BILLING_TYPE) as BillingTypeKey[]
  return keys.find((key) => BILLING_TYPE[key] === value)
}
