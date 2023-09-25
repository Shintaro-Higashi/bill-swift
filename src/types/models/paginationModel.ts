/**
 * ページング検索結果
 * @param M 検索結果レコードType
 */
export type PaginationModel<M> = {
  // 検索結果レコード
  items: M[]
  // 検索結果件数
  count: number
  // 取得した検索結果レコードの件数
  pageCount: number
}
