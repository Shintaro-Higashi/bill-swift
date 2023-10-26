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
 * 指定のタイムゾーン日時をUTC日時に変換します。
 * @param date 日時
 * @param timeZone タイムゾーン
 * @return UTC Date
 */
export const toUTCDate = (date: Date, { timeZone = 'Asia/Tokyo' } = {}) => {
  return zonedTimeToUtc(date, timeZone)
}

/**
 * 指定のタイムゾーン日時をJST日時に変換します。
 * @param date 日時
 * @param timeZone タイムゾーン
 * @return UTC Date
 */
export const toJSTDate = (date: Date | string, { timeZone = 'UTC' } = {}) => {
  return utcToZonedTime(date, timeZone)
}

/**
 * 指定の日時を指定書式の文字列に変換します。
 * @param datetime 日時
 * @param options オプション
 * @param options.fmt 書式 [yyyy-MM-dd HH:mm:ss]
 * @param options.timeZone タイムゾーン [UTC]
 * @return 指定書式変換後の日時文字列
 */
export const formatDateTime = (
  datetime: Date | undefined | null,
  options: { fmt?: string; timeZone?: string } = {},
) => {
  // "2100-12-31" は関連付けテーブルの有効期間の終了日のデフォルト値のため画面上に日付として表示しないようにする
  const argDate = datetime ? new Date(datetime) : null
  const defaultEndDate = new Date('2100-12-31T00:00:00.000Z')

  if (!datetime || !argDate || argDate.getTime() === defaultEndDate.getTime()) return ''
  const { fmt = 'yyyy-MM-dd HH:mm:ss', timeZone = 'UTC' } = options
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

/**
 * 過去日付かどうかを判定します。
 * @param Date
 * @return Boolean
 */
export const isPastDate = (date: Date) => {
  if (date.setHours(0, 0, 0, 0) < getCurrentDate().setHours(0, 0, 0, 0)) {
    return true
  } else {
    return false
  }
}
