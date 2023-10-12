/**
 * ハイフン区切りの電話番号形式か検証します。
 * <pre>
 *  文字列が空の場合は trueを返します。
 * </pre>
 * @param val 文字列
 * @return 検証結果
 */
export const validateTel = (val?: string | null) => {
  if (!val) return true
  return val.includes('-')
}
// 電話番号バリデーションエラーメッセージ
export const validateTelMessage = 'ハイフン区切りの電話番号で入力してください'
