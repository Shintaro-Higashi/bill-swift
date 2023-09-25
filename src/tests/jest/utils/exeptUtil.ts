import { ZodError } from 'zod'
import { expect } from '@jest/globals'

/**
 * ZodErrorが発生した各フィールド結果が正しいか判定します。
 * <pre>
 *  全errorFieldsに対して判定したい codeType が同一の場合に利用可能です。
 *  コード量の削減が期待できます。
 * </pre>
 * @param errors      ZodErrorList
 * @param errorFields 確認したいエラーフィルード名
 * @param codeType    確認したいエラーフィルード名のzodError内容
 */
export function exceptItems(errors: ZodError[], errorFields: string[] | Record<string, unknown>[], codeType: any) {
  if (errorFields.length === 0) throw new Error('errorFieldsに値がない')
  if (errors.length === 0) throw new Error('errorsに値がない')

  if (typeof errorFields[0] === 'string') {
    errorFields.forEach((fieldPath, index) => {
      expect(errors[index]).toEqual(expect.objectContaining({ path: [fieldPath], ...codeType }))
    })
    return
  }
  errorFields.forEach((field, index) => {
    if (typeof field !== 'string') {
      expect(errors[index]).toEqual(expect.objectContaining({ ...field, ...codeType }))
    } else {
      throw new Error('errorFieldsの要素がRecord型で統一されていません')
    }
  })
}
