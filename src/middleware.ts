import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { unauthorizedErrorResponse } from '@/core/utils/responseUtil'
import { verifyJWTToken } from '@/servers/services/tokenService'

export const config = {
  // 認証を実地するURLパターン
  matcher: '/api/:path*',
}

// matcherから除外するURL
const skipUrls: { [key: string]: boolean } = {
  '/api/auth/login': true,
  '/api/health/check': true,
}

/**
 * ルーティングに対する認証検証処理(サーバサイド側でのみ有効)です。
 * <pre>
 *  現在は api のみ検証対象としています。
 *  画面UIはlayout.tsx を利用して検証しているためです。
 *  ※[仕様注意事項]
 *  middlewareはEdgeRuntimeで動作するため一部のAPIが利用できません。
 *  具体的にはORM prisma は利用できません。
 * </pre>
 */
export async function middleware(request: NextRequest) {
  // 特定のAPIは認証スキップ
  if (skipUrls[request.nextUrl.pathname]) {
    return NextResponse.next()
  }

  const token = request.cookies.get('token')
  if (!token) return unauthorizedErrorResponse()
  // カスタムリクエストヘッダを利用して認証後のユーザ情報をどこからでも取得可能な状態にする
  const payLoad = await verifyJWTToken(token.value)
  if (!payLoad) return unauthorizedErrorResponse()
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-user-id', payLoad.id)
  requestHeaders.set('x-user-type', payLoad.userType)
  // ロールの検証用にpathnameも引き回す
  requestHeaders.set('x-pathname', request.nextUrl.pathname)
  return NextResponse.next({ request: { headers: requestHeaders } })
}
