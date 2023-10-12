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
 * 同一の型のObjectを比較して差分結果を取得します。
 * @param original 比較元Object
 * @param updated  比較先Object
 * @return 差分結果
 */
export const deepCompareJSON = (original: any, updated: any) => {
  const changes: Record<string, any> = {}

  const compareObjects = (obj1: any, obj2: any, path: string) => {
    for (const key in obj2) {
      const newPath = path ? `${path}.${key}` : key
      if (obj1[key] !== obj2[key]) {
        if (typeof obj1[key] === 'object' && typeof obj2[key] === 'object') {
          compareObjects(obj1[key], obj2[key], newPath)
        } else {
          changes[newPath] = {
            original: obj1[key],
            updated: obj2[key],
          }
        }
      }
    }
  }

  compareObjects(original, updated, '')

  return changes
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
