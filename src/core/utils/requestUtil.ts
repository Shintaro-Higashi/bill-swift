/**
 * リクエストに関する処理を定義するユーティリティです。
 */

import { z, ZodError } from 'zod'
import {
  badRequestErrorResponse,
  forbiddenErrorResponse,
  noContentResponse,
  notFoundResponse,
  unauthorizedErrorResponse,
  unprocessableEntityResponse,
} from '@/core/utils/responseUtil'
import { Prisma } from '.prisma/client'
import zodErrorMapJp from '@/core/configs/i18n/zodErrorMapJp'
import UnauthorizedError from '@/servers/core/errors/unauthorizedError'
import { headers } from 'next/headers'
import IntegrityDeletedError from '@/servers/core/errors/integrityDeletedError'
import { UserTypeKey } from '@/shared/items/userType'
import ForbiddenError from '@/servers/core/errors/forbiddenError'
import NoContentError from '@/servers/core/errors/noContentError'

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
 * @param option 現在は resource, action(アクセス権判定)のみ定義が可能。(リソース未指定時はAPIパスから自動取得)
 * @return API処理結果
 */
export const performRequest = async (cb: Function, option?: { resource?: string; action: string; id?: string }) => {
  try {
    // pathname'は/api/companies/0000000000000000000C0001'　等の値
    const pathname = headers().get('x-pathname')
    if (pathname && option?.action) {
      const resourceName = option?.resource ?? pathname.split('/')[2].toLowerCase()
      const hasRole = await validRole(resourceName, option.action)
      if (!hasRole) {
        return forbiddenErrorResponse()
      }
      // TODO 詳細系のリソース操作は共通で権限処理対応し、一覧系のみ個別に対応する方針としたい
    }

    // instrumentation上ではsetしても翻訳されないため都度設定
    if (!isSetErrorMap) {
      z.setErrorMap(zodErrorMapJp)
      isSetErrorMap = true
    }
    return await cb()
  } catch (e) {
    // 更新内容に変化がなかった場合
    if (e instanceof NoContentError) {
      return noContentResponse()
    }
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
    // 削除エラー
    if (e instanceof IntegrityDeletedError) {
      return unprocessableEntityResponse()
    }
    // 認証エラー
    if (e instanceof UnauthorizedError) {
      return unauthorizedErrorResponse()
    }
    // アクセス権限エラー
    if (e instanceof ForbiddenError) {
      return forbiddenErrorResponse
    }
    // 予期せぬエラー
    throw e
  }
}

/**
 * アクセス権限があるか判定します。
 * @param resourceName
 * @param action
 */
const validRole = async (resourceName: string, action: string) => {
  const userType = getAuthorizedUserType()
  const role = await import(`@/core/configs/roles/${userType}`)
  const roleConfig = role.default
  return roleConfig[resourceName] && roleConfig[resourceName][action] === true
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

/**
 * 認証中のユーザIDを取得します。
 */
export function getAuthorizedUserId() {
  const userId = headers().get('x-user-id')
  if (!userId) {
    throw new Error('カスタムHTTPヘッダよりユーザID取得に失敗')
  }
  return userId
}

/**
 * 認証中のユーザ種別を取得します。
 */
export function getAuthorizedUserType() {
  const userType = headers().get('x-user-type')
  if (!userType) {
    throw new Error('カスタムHTTPヘッダよりユーザ種別取得に失敗')
  }
  return userType as UserTypeKey
}
