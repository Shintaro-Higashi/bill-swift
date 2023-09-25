/**
 * リクエストに関する処理を定義するユーティリティです。
 */

import { z, ZodError } from 'zod'
import { badRequestErrorResponse, notFoundResponse } from '@/core/utils/responseUtil'
import { Prisma } from '.prisma/client'
import zodErrorMapJp from '@/core/configs/i18n/zodErrorMapJp'

let isSetErrorMap = false

/**
 * Rest APIリクエストのメイン処理を実地するWrapper処理です。
 * <pre>
 * Next.js APP Router の /api ルートはグローバルなエラーハンドラを定義する仕組みがないため、
 * 各APIのインタフェースは本関数でWrapして記述する必要があります。
 * [記述例]
 * export async function GET(_req: NextRequest, { params: { id } }: { params: ByIdRequest }) {
 *   return await performRequest(async () => {
 *     const entity = await fetchCompany(id)
 *     return NextResponse.json(entity)
 *   })
 * }
 * </pre>
 * @param cb APIリクエストメインの処理
 * @return API処理結果
 */
export const performRequest = async (cb: Function) => {
  try {
    // console.log('isSetErrorMap', isSetErrorMap)
    // instrumentation上ではsetしても翻訳されないため都度設定
    if (!isSetErrorMap) {
      z.setErrorMap(zodErrorMapJp)
      isSetErrorMap = true
    }
    return await cb()
  } catch (e) {
    // バリデーションエラー
    if (e instanceof ZodError) {
      return badRequestErrorResponse(e)
    }
    // Prismaエラー
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      // notfoundエラー
      if (e.code === 'P2025') {
        return notFoundResponse()
      }
    }

    // 予期せぬエラー
    throw e
  }
}

export function objectToQueryString(obj: Record<string, any>): string {
  const keyValuePairs = []

  for (const key in obj) {
    if (obj.hasOwnProperty(key) && obj[key] !== undefined) {
      keyValuePairs.push(encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]))
    }
  }

  return keyValuePairs.join('&')
}
