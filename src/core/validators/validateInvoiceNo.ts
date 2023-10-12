/**
 * インボイス番号形式か検証します。
 * <pre>
 *  文字列が空の場合は trueを返します。
 * </pre>
 * @param val 文字列
 * @return 検証結果
 */
export const validateInvoiceNo = (val?: string | null) => {
  if (!val) return true
  return /^T\d{13}$/.test(val)
}
// 郵便番号バリデーションエラーメッセージ
export const validateInvoiceNoMessage = 'T+13桁の形式で入力して下さい'
