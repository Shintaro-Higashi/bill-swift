import { NextRequest, NextResponse } from 'next/server'
import { getAuthorizedUserId, performRequest } from '@/core/utils/requestUtil'
import { createLoginUser } from '@/servers/services/authService'

/**
 * アクセストークンを再発行して最新ユーザ情報を取得します。
 */
export async function GET(_req: NextRequest) {
  return await performRequest(async () => {
    const userId = getAuthorizedUserId()
    const user = await createLoginUser(userId)
    return NextResponse.json(user)
  })
}
