import { z } from 'zod'
import { trimUnicode } from '@/core/utils/commonUtil'

const zBaseSchema = (message?: string) => {
  if (message) return z.string({ invalid_type_error: message }).transform((val) => trimUnicode(val, null))

  return z
    .string()
    .nullish()
    .transform((val) => trimUnicode(val, null))
}

const zOptionalBaseSchema = () => {
  return z.optional(
    z
      .string()
      .nullish()
      .transform((val) => trimUnicode(val, undefined)),
  )
}

/**
 * 書込系のフォームに利用する必須入力文字列のスキーマ定義です。
 * <pre>
 *  全角スペース、タブ、改行を含むTrimも行います。
 *  Trim後、値がない場合はnullに変換されます。
 * </pre>
 * @param maxLength 最大入力文字数(未指定の場合はチェックしない)
 * @param message エラーメッセージ
 */
export const zRequiredString = (maxLength: number = 0, message: string = '必須項目を入力してください') => {
  if (maxLength !== 0) {
    return zBaseSchema(message).pipe(z.string({ invalid_type_error: message }).min(1, message).max(maxLength))
  }
  return zBaseSchema(message).pipe(z.string({ invalid_type_error: message }).min(1, message))
}

/**
 * 主に検索フォームに利用する未必須入力文字列のスキーマ定義です(null,undefinedどちらも許容します)。
 * <pre>
 *  全角スペース、タブ、改行を含むTrimも行います。
 *  Trim後、値がない場合はnullに変換されます。
 * </pre>
 * @param maxLength 最大入力文字数(未指定の場合はチェックしない)
 */
export const zNullishString = (maxLength: number = 0) => {
  if (maxLength !== 0) {
    return zBaseSchema().pipe(z.string().max(maxLength).nullish())
  }
  return zBaseSchema().pipe(z.string().nullish())
}

/**
 * 未必須入力文字列のスキーマ定義です。undefinedのみを許容します。
 * <pre>
 *  全角スペース、タブ、改行を含むTrimも行います。
 *  Trim後、値がない場合はundefinedに変換されます。
 * </pre>
 * @param maxLength 最大入力文字数(未指定の場合はチェックしない)
 */
export const zOptionalString = (maxLength: number = 0) => {
  if (maxLength !== 0) {
    return zOptionalBaseSchema().pipe(z.optional(z.string().max(maxLength)))
  }
  return zOptionalBaseSchema().pipe(z.optional(z.string()))
}

export const zStringSelectMessage = '必須項目を選択してください'
