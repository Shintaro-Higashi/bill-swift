/**
 * 施設で利用する支払い種別Enum関連リストです。
 * ※患者にも同じ物理名があるので注意が必要です。
 */

/** 支払い種別 */
export const HEALTH_FACILITY_PAYMENT_TYPE = {
  CASH: '現金',
  WITHDRAWAL: '振替',
  TRANSFER: '振込',
  OTHER: 'その他',
} as const

/** 支払い種別Enum */
export type HealthFacilityPaymentType = typeof HEALTH_FACILITY_PAYMENT_TYPE
/** 支払い種別キー */
export type HealthFacilityPaymentTypeKey = keyof typeof HEALTH_FACILITY_PAYMENT_TYPE
/** 支払い種別値 */
export type HealthFacilityPaymentTypeValue =
  (typeof HEALTH_FACILITY_PAYMENT_TYPE)[keyof typeof HEALTH_FACILITY_PAYMENT_TYPE]

/** 支払い種別キーリスト */
export const HEALTH_FACILITY_PAYMENT_TYPE_KEY_LIST = Object.keys(
  HEALTH_FACILITY_PAYMENT_TYPE,
) as readonly HealthFacilityPaymentTypeKey[]

/** 支払い種別リスト */
export const HEALTH_FACILITY_PAYMENT_TYPE_LIST = HEALTH_FACILITY_PAYMENT_TYPE_KEY_LIST.map((key) => ({
  key: key,
  value: HEALTH_FACILITY_PAYMENT_TYPE[key],
}))

/**
 * 支払い種別キーから値を取得します。
 * @param key 支払い種別キー
 * @param defaultValue 該当キーがない場合のデフォルト値
 * @return 支払い種別値
 */
export const getHealthFacilityPaymentTypeValue = (key: HealthFacilityPaymentTypeKey, defaultValue: string = '') => {
  if (key in HEALTH_FACILITY_PAYMENT_TYPE) {
    return HEALTH_FACILITY_PAYMENT_TYPE[key as HealthFacilityPaymentTypeKey]
  }
  return defaultValue
}

/**
 * 支払い種別値からキーを取得します。
 * @param value 支払い種別値
 * @return 支払い種別値。該当key情報がない場合はundefined
 */
export const getHealthFacilityPaymentTypeKey = (
  value: HealthFacilityPaymentTypeValue | string,
): HealthFacilityPaymentTypeKey | undefined => {
  const keys = Object.keys(HEALTH_FACILITY_PAYMENT_TYPE) as HealthFacilityPaymentTypeKey[]
  return keys.find((key) => HEALTH_FACILITY_PAYMENT_TYPE[key] === value)
}
