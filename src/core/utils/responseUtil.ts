import { NextResponse } from 'next/server'
import { ZodError } from 'zod'
import { HTTP_STATUS } from '@/core/configs/constants'

const headers = { 'content-type': 'application/json' }

/**
 * バリデーションエラーが発生した時のHTTPレスポンス情報です。
 * @param zodError バリデーションエラー情報
 * @return HTTPレスポンス
 */
export const badRequestErrorResponse = (zodError: ZodError) => {
  return new NextResponse(JSON.stringify({ success: false, message: 'Bad Request', error: zodError.issues }), {
    status: HTTP_STATUS.BAD_REQUEST,
    headers,
  })
}

/**
 * 該当データが見つからい場合のHTTPレスポンス情報です。
 * @return HTTPレスポンス
 */
export const notFoundResponse = () => {
  return new NextResponse(JSON.stringify({ success: false, message: 'Not Found' }), {
    status: HTTP_STATUS.NOT_FOUND,
    headers,
  })
}
