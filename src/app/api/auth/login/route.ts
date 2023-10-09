import { LoginSchema } from '@/types'
import { NextRequest, NextResponse } from 'next/server'
import { performRequest } from '@/core/utils/requestUtil'
import { login } from '@/servers/services/authService'

/**
 * ログイン認証APIです。
 * @param req リクエスト情報
 */
export async function POST(req: NextRequest) {
  return await performRequest(async () => {
    const loginRequest = await req.json()
    const parsedLoginRequest = LoginSchema.parse(loginRequest)
    const loginUser = await login(parsedLoginRequest)
    return NextResponse.json(loginUser)
  })
}
