/** 振込案内 */
export const TRANSFER_GUIDE = {
  MIZUHO: 'みずほ',
  RISONA: 'りそな',
  JA: 'JA',
  OTHER: 'その他',
} as const

/** 振込案内Enum */
export type TransferGuide = typeof TRANSFER_GUIDE
/** 振込案内キー */
export type TransferGuideKey = keyof typeof TRANSFER_GUIDE
/** 振込案内値 */
export type TransferGuideValue = (typeof TRANSFER_GUIDE)[keyof typeof TRANSFER_GUIDE]

/** 振込案内キーリスト */
export const TRANSFER_GUIDE_KEY_LIST = Object.keys(TRANSFER_GUIDE) as readonly TransferGuideKey[]

/** 振込案内リスト */
export const TRANSFER_GUIDE_LIST = TRANSFER_GUIDE_KEY_LIST.map((key) => ({
  key: key,
  value: TRANSFER_GUIDE[key],
}))

/**
 * 振込案内キーから値を取得します。
 * @param key 振込案内キー
 * @param defaultValue 該当キーがない場合のデフォルト値
 * @return 振込案内値
 */
export const getTransferGuideValue = (key: TransferGuideKey | null | undefined, defaultValue: string = '') => {
  if (!key) return defaultValue
  if (key in TRANSFER_GUIDE) {
    return TRANSFER_GUIDE[key as TransferGuideKey]
  }
  return defaultValue
}

/**
 * 振込案内値からキーを取得します。
 * @param value 振込案内値
 * @return 振込案内値。該当key情報がない場合はundefined
 */
export const getTransferGuideKey = (value: TransferGuideValue | string): TransferGuideKey | undefined => {
  const keys = Object.keys(TRANSFER_GUIDE) as TransferGuideKey[]
  return keys.find((key) => TRANSFER_GUIDE[key] === value)
}
