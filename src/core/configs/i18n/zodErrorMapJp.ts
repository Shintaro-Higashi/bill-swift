import { util, ZodErrorMap, ZodIssueCode, ZodParsedType } from 'zod'

/**
 * バリデーションライブラリZodのデフォルトメッセージを日本語化します。
 * <pre>
 *   z.setErrorMap(customErrorMap);
 * </pre>
 * @param issue
 * @param _ctx
 */
const errorMap: ZodErrorMap = (issue, _ctx) => {
  let message: string
  switch (issue.code) {
    case ZodIssueCode.invalid_type:
      if (issue.received === ZodParsedType.undefined) {
        message = '必須項目を入力してください'
      } else {
        message = `データ型：${JSON.stringify(issue.expected)}で入力してください（入力値：${JSON.stringify(
          issue.received,
        )}）`
      }
      break
    case ZodIssueCode.invalid_literal:
      message = `次の値を入力してください【${JSON.stringify(issue.expected, util.jsonStringifyReplacer)}】`
      break
    case ZodIssueCode.unrecognized_keys:
      message = `不正な値が入力されました: ${util.joinValues(issue.keys, ', ')}`
      break
    case ZodIssueCode.invalid_union:
      message = `不正な値が入力されました`
      break
    case ZodIssueCode.invalid_union_discriminator:
      message = `【${issue.options.map((value) => JSON.stringify(value))}】のいずれかの値を入力してください`
      break
    case ZodIssueCode.invalid_enum_value:
      message = `【${issue.options.map((value) => JSON.stringify(value))}】のいずれかの値を入力してください`
      break
    case ZodIssueCode.invalid_arguments:
      message = `不正な値が入力されました`
      break
    case ZodIssueCode.invalid_return_type:
      message = `不正な値が入力されました`
      break
    case ZodIssueCode.invalid_date:
      message = `不正な日付が入力されました`
      break
    case ZodIssueCode.invalid_string:
      if (typeof issue.validation === 'object') {
        if ('includes' in issue.validation) {
          message = `必ず${JSON.stringify(issue.validation.includes)}を含む文字列を入力してください`

          if (typeof issue.validation.position === 'number') {
            message = `${message}　${JSON.stringify(issue.validation.position)}以降で不正な値が検出されました`
          }
        } else if ('startsWith' in issue.validation) {
          message = `${JSON.stringify(issue.validation.startsWith)}で始まる文字列を入力してください`
        } else if ('endsWith' in issue.validation) {
          message = `${JSON.stringify(issue.validation.endsWith)}"で終わる文字列を入力してください`
        } else {
          util.assertNever(issue.validation)
        }
      } else if (issue.validation !== 'regex') {
        message = `不正な値が入力されました ${JSON.stringify(issue.validation)}`
      } else {
        message = '不正な値が入力されました'
      }
      break
    case ZodIssueCode.too_small:
      if (issue.type === 'array')
        message = `${JSON.stringify(issue.minimum)}個${
          issue.exact ? `の` : issue.inclusive ? `以上の` : `より多く`
        }項目を選択してください`
      else if (issue.type === 'string')
        message = `${JSON.stringify(issue.minimum)}文字${
          issue.exact ? `` : issue.inclusive ? `以上` : `より多く`
        }で入力してください`
      else if (issue.type === 'number')
        message = `${JSON.stringify(issue.minimum)}${
          issue.exact ? `を` : issue.inclusive ? `以上で` : `より多く`
        }入力してください`
      else if (issue.type === 'date')
        message = `日付は${JSON.stringify(new Date(Number(issue.minimum)))}${
          issue.exact ? `` : issue.inclusive ? `以降` : `より先の日程`
        }を入力してください`
      else message = '不正な値が入力されました'
      break
    case ZodIssueCode.too_big:
      if (issue.type === 'array')
        message = `${JSON.stringify(issue.maximum)}個${
          issue.exact ? `` : issue.inclusive ? `以下` : `未満`
        }の項目を選択してください`
      else if (issue.type === 'string')
        message = `${JSON.stringify(issue.maximum)}文字${
          issue.exact ? `` : issue.inclusive ? `以下` : `未満`
        }で入力してください`
      else if (issue.type === 'number')
        message = `${JSON.stringify(issue.maximum)}${
          issue.exact ? `` : issue.inclusive ? `以下` : `未満`
        }で入力してください`
      else if (issue.type === 'bigint')
        message = `BigIntは${JSON.stringify(issue.maximum)}${
          issue.exact ? `` : issue.inclusive ? `以下` : `未満`
        }で入力してください`
      else if (issue.type === 'date')
        message = `日付は${JSON.stringify(new Date(Number(issue.maximum)))}${
          issue.exact ? `` : issue.inclusive ? `以前` : `より前の日程`
        }を入力してください`
      else message = '不正な値が入力されました'
      break
    case ZodIssueCode.custom:
      message = `不正な値が入力されました`
      break
    case ZodIssueCode.invalid_intersection_types:
      message = `不正な値が入力されました`
      break
    case ZodIssueCode.not_multiple_of:
      message = `${issue.multipleOf}の倍数を入力してください`
      break
    case ZodIssueCode.not_finite:
      message = '有効な数値を入力してください'
      break
    default:
      message = _ctx.defaultError
      util.assertNever(issue)
  }
  return { message }
}

export default errorMap

export const validateEmailMessage = 'メールアドレスの形式で入力してください'
export const validateUrlMessage = 'URLの形式で入力してください'
