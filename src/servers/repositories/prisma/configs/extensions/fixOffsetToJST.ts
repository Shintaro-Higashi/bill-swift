// UTCからJSTに補正するオフセット値
const OFFSET_TIME_JST = 9 * 60 * 60 * 1000

/**
 * 指定のObjectが持つDateフィールドの時刻の補正をします。
 * <pre>
 *  Prismaの仕様に準拠してobject内の全DateフィールドはUTCであることが前提の実装です。
 * </pre>
 * @param object Prismaのwhere値、または登録更新値
 * @param offsetTime 補正するオフセット(規準はUTC)
 */
function fixUTCDatetimeToOffset(object: any, offsetTime: number = OFFSET_TIME_JST) {
  if (Array.isArray(object)) {
    object.forEach((o) => fixUTCDatetimeToOffset(o, offsetTime))
    return
  }
  if (object == null || typeof object !== 'object') return

  for (const [key, value] of Object.entries(object)) {
    if (value instanceof Date) {
      object[key] = new Date(value.getTime() + offsetTime)
    } else {
      fixUTCDatetimeToOffset(value, offsetTime)
    }
  }
}

/**
 * Prismaが強制的にDate系列の型をUTCに変換してDBへ格納する仕様を回避してJSTでテーブルへ格納するためのextensionです。
 * <pre>
 *  検索、登録、更新時にUTC変換されているDateObjectを持つフィールドに対してJSTに強制変換します。
 * </pre>
 */
const fixOffsetToJST = {
  name: 'fixOffsetToJST',
  query: {
    // eslint-disable-next-line
    async $allOperations({ args, query }: { args: any; query: any }) {
      fixUTCDatetimeToOffset(args)
      return await query(args)
    },
  },
}

export default fixOffsetToJST
