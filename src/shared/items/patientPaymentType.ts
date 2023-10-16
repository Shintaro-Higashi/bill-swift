/**
 * 患者で利用する支払い種別Enum関連リストです。
 * ※患者にも同じ物理名があるので注意が必要です。
 */

/** 支払い種別 */
export const PATIENT_PAYMENT_TYPE = {
  UNDEFINED: '未確認',
  CASH: '現金',
  WITHDRAWAL: '振替',
  WITHDRAWAL_STOP: '振替変更（停止）',
  WITHDRAWAL_CONTINUE: '振替変更（継続）',
  TRANSFER: '振込',
  CONVENIENCE: 'コンビニ払い',
  LATER: '後払い',
} as const

/** 支払い種別Enum */
export type PatientPaymentType = typeof PATIENT_PAYMENT_TYPE
/** 支払い種別キー */
export type PatientPaymentTypeKey = keyof typeof PATIENT_PAYMENT_TYPE
/** 支払い種別値 */
export type PatientPaymentTypeValue = (typeof PATIENT_PAYMENT_TYPE)[keyof typeof PATIENT_PAYMENT_TYPE]

/** 支払い種別キーリスト */
export const PATIENT_PAYMENT_TYPE_KEY_LIST = Object.keys(PATIENT_PAYMENT_TYPE) as readonly PatientPaymentTypeKey[]

/** 支払い種別リスト */
export const PATIENT_PAYMENT_TYPE_LIST = PATIENT_PAYMENT_TYPE_KEY_LIST.map((key) => ({
  key: key,
  value: PATIENT_PAYMENT_TYPE[key],
}))

/**
 * 支払い種別キーから値を取得します。
 * @param key 支払い種別キー
 * @param defaultValue 該当キーがない場合のデフォルト値
 * @return 支払い種別値
 */
export const getPatientPaymentTypeValue = (
  key: PatientPaymentTypeKey | null | undefined,
  defaultValue: string = '',
) => {
  if (!key) return defaultValue
  if (key in PATIENT_PAYMENT_TYPE) {
    return PATIENT_PAYMENT_TYPE[key as PatientPaymentTypeKey]
  }
  return defaultValue
}

/**
 * 支払い種別値からキーを取得します。
 * @param value 支払い種別値
 * @return 支払い種別値。該当key情報がない場合はundefined
 */
export const getPatientPaymentTypeKey = (
  value: PatientPaymentTypeValue | string,
): PatientPaymentTypeKey | undefined => {
  const keys = Object.keys(PATIENT_PAYMENT_TYPE) as PatientPaymentTypeKey[]
  return keys.find((key) => PATIENT_PAYMENT_TYPE[key] === value)
}
