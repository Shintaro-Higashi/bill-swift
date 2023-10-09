/**
 * 定数定義です。
 * <pre>
 *  異なる実行環境でも同一値の扱いとする情報のみを定義します。
 * </pre>
 */

// HTTPステータスコード
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  BAD_REQUEST: 400,
  INTERNAL_SERVER_ERROR: 500,
}

// 検索条件フォームのhintメッセージ
export const QUERY_FORM_HINT = {
  MATCH: '条件:完全一致',
  CONTAIN: '条件:一部を含む',
}

// ページネーションに関する設定情報
export const PAGINATE_CONFIG = {
  // デフォルトのページサイズ(perPage)
  DEFAULT_PAGE_SIZE: 25,
  // 最大ページサイズ
  MAX_PAGE_SIZE: 100,
}

// デフォルト日付フォーマット
export const DATE_FORMAT = 'YYYY/MM/DD HH:mm'
