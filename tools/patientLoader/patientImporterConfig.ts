import { PatientAccountConfirmStatus, PatientGender, PatientPaymentType } from '@prisma/client'

// 顧客CSV格納パス
export const CSV_PATH = '/tmp/csv'

// デフォルト設定する開始日付
export const DEFAULT_START_DATE = new Date('2000-01-01T00:00:00.000Z')

// 登録・更新日付
export const REGIST_DATE = new Date()
// 登録・更新ユーザーID
export const REGIST_USER = '0000000000000000000U0001'

// 部門CDと薬局IDのマッピング（オリーブ）
const CD_ID_MAP_OLIVE = [
  // オリーブ薬局 西浦和店
  { cd: '1', id: '0000000000000000000P0012' },
  // オリーブ薬局 大宮大成店
  { cd: '2', id: '0000000000000000000P0013' },
]

// 部門CDと薬局IDのマッピング（リンクス）
const CD_ID_MAP_LINKS = [
  // リンクス薬局
  { cd: '1', id: '0000000000000000000P0014' },
]

// 部門CDと薬局IDのマッピング（セントラル・ひまわり）
const CD_ID_MAP_GREEN = [
  // セントラル薬局 浦和店
  { cd: '1', id: '0000000000000000000P0001' },
  // セントラル薬局 武蔵浦和店
  { cd: '2', id: '0000000000000000000P0002' },
  // セントラル薬局 永福店
  { cd: '3', id: '0000000000000000000P0003' },
  // セントラル薬局 練馬店
  { cd: '4', id: '0000000000000000000P0004' },
  // セントラル薬局 蕨店
  { cd: '5', id: '0000000000000000000P0005' },
  // セントラル薬局 川崎梶ヶ谷店
  { cd: '6', id: '0000000000000000000P0006' },
  // セントラル薬局 横浜仲町台店
  { cd: '7', id: '0000000000000000000P0007' },
  // セントラル薬局 武蔵小杉店
  { cd: '8', id: '0000000000000000000P0008' },
  // ひまわり薬局 所沢店
  { cd: '101', id: '0000000000000000000P0009' },
  // ひまわり薬局 東所沢店
  { cd: '102', id: '0000000000000000000P0010' },
  // ひまわり薬局 狭山ヶ丘店
  { cd: '103', id: '0000000000000000000P0011' },
]

/**
 * 部門名と部門CDと初期登録マスタデータから薬局IDを取得します。
 * @param code 部門CD
 * @param name 部門名
 * @returns 薬局ID
 */
export const findPharmacyId = (code: string, name: string): string => {
  let codeIdMap = null
  if (name.startsWith('オリーブ') || name.startsWith('オリ－ブ')) {
    codeIdMap = CD_ID_MAP_OLIVE
  } else if (name.startsWith('リンクス')) {
    codeIdMap = CD_ID_MAP_LINKS
  } else {
    codeIdMap = CD_ID_MAP_GREEN
  }
  const codeId = codeIdMap.find((data) => data.cd === code)
  if (!codeId) {
    throw new Error(
      `部門CDに一致する定義が存在しませんでした。部門CD=${code}, 部門名=${name}, マップ=${JSON.stringify(codeIdMap)}`,
    )
  }
  return codeId.id
}

/**
 * コードの値に対応したenumの値を取得します。
 * @param code 分類CD3
 * @returns 支払方法のenum値
 */
export const getPatientPaymentType = (code: string): PatientPaymentType => {
  switch (code) {
    case '1':
      return PatientPaymentType.WITHDRAWAL
    case '2':
      return PatientPaymentType.TRANSFER
    case '3':
      return PatientPaymentType.CASH
    case '4':
      return PatientPaymentType.LATER
    case '5':
      return PatientPaymentType.CONVENIENCE
    default:
      return PatientPaymentType.UNDEFINED
  }
}

/**
 * コードの値に対応したenumの値を取得します。
 * @param code 分類CD4
 * @returns 口座振替ステータスのenum値
 */
export const getAccountStatus = (code: string): PatientAccountConfirmStatus | null => {
  switch (code) {
    case '1':
      return PatientAccountConfirmStatus.AVAILABLE
    case '2':
      return PatientAccountConfirmStatus.UNCOLLECTED
    case '3':
      return PatientAccountConfirmStatus.INVALID
    default:
      return null
  }
}

/**
 * 性別に対応したenumの値を取得します。
 * @param val 性別
 * @returns 性別のenum値
 */
export const getGender = (val: string): PatientGender => {
  switch (val) {
    case '男':
      return PatientGender.MALE
    case '女':
      return PatientGender.FEMALE
    default:
      return PatientGender.UNCERTAIN
  }
}
