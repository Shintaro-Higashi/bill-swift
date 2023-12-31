/**
 * URLからパスパラメータIDを取得します。
 * @param url パスパラメータID
 */
export const getIdFromURL = (url: string) => {
  return Number(url.split('/')?.pop()?.split('?')?.[0])
}
