/**
 * 指定ミリ秒待機します。
 * @param ms 待機時間(単位:ミリ秒)
 */
export const sleep = async (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
