import { NextRequest, NextResponse } from 'next/server'
import { getAuthorizedUserId, getAuthorizedUserType, performRequest } from '@/core/utils/requestUtil'
import { createJWTToken } from '@/servers/services/tokenService'

/**
 * アクセストークンを再発行します。
 * <pre>
 *  repositoryを参照しない軽量APIのためユーザの詳細情報は取得しません。
 *  必要な場合は /auth APIを利用してください。
 * </pre>
 */
export async function GET(_req: NextRequest) {
  return await performRequest(async () => {
    const userId = getAuthorizedUserId()
    const userType = getAuthorizedUserType()
    return NextResponse.json({ token: await createJWTToken(userId, userType) })
  })
}
