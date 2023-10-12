/**
 * ハイフン区切りの郵便番号形式か検証します。
 * <pre>
 *  文字列が空の場合は trueを返します。
 * </pre>
 * @param val 文字列
 * @return 検証結果
 */
export const validatePostalCode = (val?: string | null) => {
  if (!val) return true
  return /^\d{3}-\d{4}$/.test(val)
}
// 郵便番号バリデーションエラーメッセージ
export const validatePostalCodeMessage = '3桁-4桁の形式で入力してください'
