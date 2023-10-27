import { NextRequest } from 'next/server'
import { performRequest } from '@/core/utils/requestUtil'

/**
 * 患者関連施設の予約変更を処理するバッチ疑似APIです。
 *
 */
export async function GET(_req: NextRequest) {
  return await performRequest(async () => {
    // 予約処理が必要な関連施設情報を取得
    // あとは1件ずつサービス処理
    // 予約処理(１件ずつトランザクション処理が望ましそう。１件エラーで全処理が停止するのはよろしくない
  })
}
