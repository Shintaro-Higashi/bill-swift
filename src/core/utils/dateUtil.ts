import { format, formatInTimeZone, utcToZonedTime, zonedTimeToUtc } from 'date-fns-tz'

/**
 * 日付に関連するユーティリティ関数を提供します。
 */

/**
 * 現在日時を指定timeZoneで取得します。
 * @param timeZone デフォルト Asia/Tokyo
 * @return timeZoneのDate
 */
export const getCurrentDate = ({ timeZone = 'Asia/Tokyo' } = {}): Date => {
  return utcToZonedTime(new Date(), timeZone)
}

/**
 * 現在日時を指定の形式、タイムゾーンで取得します。
 * @param fmt 日付形式
 * @param timeZone タイムゾーン
 * @return フォーマットされた現在日時文字列
 */
export const getCurrentFormatDate = ({ fmt = 'yyyy-MM-dd HH:mm:ss', timeZone = 'Asia/Tokyo' } = {}) => {
  return format(getCurrentDate(), fmt, { timeZone })
}

/**
 * アプリケーション上で扱っている最大範囲日時をJST日時で取得します。
 */
export const getEndMaxDate = () => {
  return toJSTDate('2100-12-31')
}

// /**
//  * 指定のタイムゾーン日時をUTC日時に変換します。
//  * @param date 日時
//  * @param timeZone タイムゾーン
//  * @return UTC Date
//  */
// export const toUTCDate = (date: Date, { timeZone = 'Asia/Tokyo' } = {}) => {
//   return zonedTimeToUtc(date, timeZone)
// }

/**
 * 指定のタイムゾーン日時をJST日時に変換します。
 * @param date 日時
 * @param timeZone タイムゾーン
 * @return UTC Date
 */
export const toJSTDate = (date: Date | string, { timeZone = 'UTC' } = {}) => {
  return utcToZonedTime(typeof date === 'string' ? new Date(date) : date, timeZone)
}

/**
 * 指定の日時を指定書式の文字列に変換します。
 * @param datetime 日時
 * @param options オプション
 * @param options.fmt 書式 [yyyy-MM-dd HH:mm:ss]
 * @param options.timeZone タイムゾーン [Asia/Tokyo]
 * @return 指定書式変換後の日時文字列
 */
export const formatDateTime = (
  datetime: Date | undefined | null,
  options: { fmt?: string; timeZone?: string } = {},
) => {
  if (typeof datetime === 'string') throw new Error(`formatDateTimeに文字列を渡すことはできません:'${datetime}`)
  // "2100-12-31" は関連付けテーブルの有効期間の終了日のデフォルト値のため画面上に日付として表示しないようにする
  const argDate = datetime ?? null

  if (!datetime || !argDate || argDate.getTime() === getEndMaxDate().getTime()) return ''
  const { fmt = 'yyyy-MM-dd HH:mm:ss', timeZone = 'Asia/Tokyo' } = options
  return formatInTimeZone(datetime, timeZone, fmt)
}

/**
 * 指定の日時を日付形式の文字列に変換します。
 * @param datetime 日時
 * @param options オプション
 * @return 指定書式変換後の日付文字列
 */
export const formatDate = (datetime: Date | undefined | null, options: { timeZone?: string } = {}) => {
  return formatDateTime(datetime, { fmt: 'yyyy-MM-dd', timeZone: options?.timeZone })
}
