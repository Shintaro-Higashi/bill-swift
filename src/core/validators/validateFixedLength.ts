/**
 * 指定文字数か検証します。
 * <pre>
 *  文字列が空の場合は trueを返します。
 * </pre>
 * @param val 文字列
 * @param length 検証文字数
 * @return 検証結果
 */
export const validateFixedLength = (val: string | null | undefined, length: number) => {
  if (!val) return true
  return val.length === length
}
// 郵便番号バリデーションエラーメッセージ
export const validateFixedLengthMessage = (length: number) => `${length}文字で入力してください`
