import { toJSTDate } from '@/core/utils/dateUtil'

/**
 * URLSearchParamsをObjectに変換します。
 * <pre>
 *  一覧検索などのクエリパラメータをObject化してtypesafeで記述できるようにすることを目的としています。
 *  変換後は通常はzodを利用して必ず入力の検証も必要とします。
 * </pre>
 * @param query クエリ
 * @return オブジェクト化したクエリ
 */
export const queryToObject = <T>(query: URLSearchParams): T => {
  const params: any = {}
  query.forEach((value, key) => {
    let decodedKey = decodeURIComponent(key)
    let decodedValue = decodeURIComponent(value)
    // This key is part of an array
    if (decodedKey.endsWith('[]')) {
      decodedKey = decodedKey.replace('[]', '')
      params[decodedKey] || (params[decodedKey] = [])
      params[decodedKey].push(decodedValue)
    } else {
      params[decodedKey] = decodedValue
    }
  })

  return params
}

const iso8601Regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/

/**
 * Objectを精査してkey名およびvalueの形式から本来Date型と推測できる値をJST Date型に変換します。
 * <pre>
 * サーバ上ではDate型で扱っているがRestAPI Response結果を通すとフロント側ではJSONの仕様上文字列に
 * 変換されてしまうため期待するResponseのType定義と実値の型が異なる問題を回避するための処理です。
 * またレスポンスが返す日時はすべてJSTであるためDate型に変換する時はJST時刻への変換も行います。
 * </pre>
 * @param obj 引数指定のObject(copyではなく元のObject valueを書き換えて返します)
 */
export function toDateForStringDate(obj: any) {
  if (!obj) {
    return obj
  }
  if (Array.isArray(obj)) {
    // 渡されたオブジェクトが配列の場合
    for (const item of obj) {
      toDateForStringDate(item) // 配列内の各要素を再帰的に検査
    }
  } else if (typeof obj === 'object' && obj !== null) {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const value = obj[key]
        if (key === 'birthday' || key.endsWith('At') || key.endsWith('Date') || key.endsWith('Datetime')) {
          // プロパティ名が指定の条件を満たす場合
          if (typeof value === 'string' && iso8601Regex.test(value)) {
            // 値の書式が指定の条件を満たす場合
            obj[key] = toJSTDate(value)
          }
        }
        // プロパティがオブジェクトである場合、再帰的に検査
        if (Array.isArray(value) || typeof value === 'object') {
          toDateForStringDate(value)
        }
      }
    }
  }
  return obj
}

/**
 * .区切りのリテラルからオブジェクトのプロパティ値を階層を意識して取得します。
 * <pre>
 *   例 : getPropertyByFlatKey({a: {b: {c: 1}}}, 'a.b.c') => 1
 * </pre>
 * @param obj オブジェクト
 * @param propKey .区切りのプロパティ名
 * @return 該当プロパティの値(ない場合はundefined)
 */
export const getPropertyByFlatKey = <T>(obj: T, propKey: string): any => {
  const keys = propKey.split('.')
  return keys.reduce((o: any, k: string) => (o || {})[k], obj)
}

/**
 * 半角スペース以外に全角スペース、タブ、改行も対象に文字列をtrimします。
 *
 * @param value 文字列
 * @param replaceEmptyValue trim後値がない(空文字,null,undefined)場合に変換する値
 * @return trim後の文字列
 */
export const trimUnicode = (value: string | null | undefined, replaceEmptyValue: string | null | undefined) => {
  if (value == null || value === '') return replaceEmptyValue
  const trimValue = value.replace(/^\s+|\s+$/g, '')
  if (value === '') return replaceEmptyValue
  return trimValue
}

/**
 * 値がない(null,undefined,空文字)を無視して配列文字列を連結します。
 * @param values 配列文字列
 * @param separate 連結時のセパレータ文字(デフォルト=\n)
 */
export const joinString = (values: (string | null | undefined)[], separate = '\n') => {
  return values.filter((item): item is NonNullable<typeof item> => item != null && item !== '').join(separate)
}

/**
 * 一部テーブルに存在する検索用名称の値を生成します。
 * <pre>
 *  余計な空白等の文字を取り除いて名前とカナを連結した値を検索用名称として扱います。
 * </pre>
 * @param name 名前
 * @param nameKana 名前カナ
 */
export const createSearchName = (name: string, nameKana: string) => {
  return name.replace(/[\s\u3000]+/g, '') + nameKana.replace(/[\s\u3000]+/g, '')
}
