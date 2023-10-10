/**
 * 参照整合性制約違反が理由で論理削除に失敗した場合にthrowするエラー情報です。
 */
export default class IntegrityDeletedError extends Error {}
