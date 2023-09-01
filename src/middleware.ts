import { authProvider } from '@/core/providers/authProvider'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

/**
 * ルーティングに対する認証検証処理です。
 * <pre>
 *  現在は api のみ検証対象としています。
 *  画面UIはlayout.tsx を利用して検証しているためです。
 * </pre>
 */
export const config = {
  // 認証を実地するURLパターン
  matcher: '/api/:path*',
}

async function checkAuth(authCookie: string | undefined) {
  return await authProvider.check(authCookie)
}

// noinspection JSUnusedGlobalSymbols
export async function middleware(request: NextRequest) {
  const auth = request.cookies.get('auth')
  const { authenticated } = await checkAuth(auth?.value)
  if (authenticated) {
    return NextResponse.next()
  } else {
    return new NextResponse(JSON.stringify({ success: false, message: 'authentication failed' }), {
      status: 401,
      headers: { 'content-type': 'application/json' },
    })
  }
}
