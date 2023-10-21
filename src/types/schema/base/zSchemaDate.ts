import { z } from 'zod'

/**
 * 日付系のフォームに利用する必須入力のスキーマ定義です。
 * @param message エラーメッセージ
 */
export const zRequiredDate = (message: string = '必須項目を入力してください') => {
  return z.preprocess(
    (val) => {
      if (val) {
        return new Date(val as string)
      } else {
        return null
      }
    },
    z.date({ invalid_type_error: message }),
  )
}

/**
 * 日付系のフォームに利用する未必須入力のスキーマ定義です。(null,undefinedどちらも許容します)。
 * @param なし
 */
export const zNullishDate = () => {
  return z.coerce.date().nullish()
}
