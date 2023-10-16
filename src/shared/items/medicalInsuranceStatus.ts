/** 保険ステータス(医療、介護共通) */
export const INSURANCE_STATUS = {
  UNCONFIRMED: '未確認',
  CONFIRMED: '確認済',
  UPDATING: '更新中',
} as const

/** 保険ステータスEnum */
export type InsuranceStatus = typeof INSURANCE_STATUS
/** 保険ステータスキー */
export type InsuranceStatusKey = keyof typeof INSURANCE_STATUS
/** 保険ステータス値 */
export type InsuranceStatusValue = (typeof INSURANCE_STATUS)[keyof typeof INSURANCE_STATUS]

/** 保険ステータスキーリスト */
export const INSURANCE_STATUS_KEY_LIST = Object.keys(INSURANCE_STATUS) as readonly InsuranceStatusKey[]

/** 保険ステータスリスト */
export const INSURANCE_STATUS_LIST = INSURANCE_STATUS_KEY_LIST.map((key) => ({
  key: key,
  value: INSURANCE_STATUS[key],
}))

/**
 * 保険ステータスキーから値を取得します。
 * @param key 保険ステータスキー
 * @param defaultValue 該当キーがない場合のデフォルト値
 * @return 保険ステータス値
 */
export const getInsuranceStatusValue = (key: InsuranceStatusKey | null | undefined, defaultValue: string = '') => {
  if (!key) return defaultValue
  if (key in INSURANCE_STATUS) {
    return INSURANCE_STATUS[key as InsuranceStatusKey]
  }
  return defaultValue
}

/**
 * 保険ステータス値からキーを取得します。
 * @param value 保険ステータス値
 * @return 保険ステータス値。該当key情報がない場合はundefined
 */
export const getInsuranceStatusKey = (
  value: InsuranceStatusValue | string | undefined,
): InsuranceStatusKey | undefined => {
  const keys = Object.keys(INSURANCE_STATUS) as InsuranceStatusKey[]
  return keys.find((key) => INSURANCE_STATUS[key] === value)
}
