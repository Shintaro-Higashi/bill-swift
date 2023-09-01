import { utcToZonedTime, zonedTimeToUtc, format } from 'date-fns-tz'

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
