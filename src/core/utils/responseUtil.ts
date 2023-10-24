import { NextResponse } from 'next/server'
import { ZodError } from 'zod'
import { HTTP_STATUS } from '@/core/configs/constants'

const headers = { 'content-type': 'application/json' }

/**
 * 更新結果、変更がなかった場合のHTTPレスポンス情報です。
 * @param zodError バリデーションエラー情報
 * @return HTTPレスポンス
 */
export const noContentResponse = () => {
  return new NextResponse(null, {
    status: HTTP_STATUS.NO_CONTENT,
    headers,
  })
}

/**
 * 認証エラーが発生した時のHTTPレスポンス情報です。
 * @param message エラーメッセージ
 * @return HTTPレスポンス
 */
export const unauthorizedErrorResponse = (message: string = 'Unauthorized') => {
  return new NextResponse(JSON.stringify({ success: false, message }), {
    status: HTTP_STATUS.UNAUTHORIZED,
    headers,
  })
}

/**
 * アクセス権限エラーが発生した時のHTTPレスポンス情報です。
 * @param message エラーメッセージ
 * @return HTTPレスポンス
 */
export const forbiddenErrorResponse = (message: string = 'アクセス権限がありません') => {
  return new NextResponse(JSON.stringify({ success: false, message }), {
    status: HTTP_STATUS.FORBIDDEN,
    headers,
  })
}

/**
 * バリデーションエラーが発生した時のHTTPレスポンス情報です。
 * @param zodError バリデーションエラー情報
 * @return HTTPレスポンス
 */
export const badRequestErrorResponse = (zodError: ZodError) => {
  return new NextResponse(
    JSON.stringify({ success: false, message: '入力情報に誤りがあります', error: zodError.issues }),
    {
      status: HTTP_STATUS.BAD_REQUEST,
      headers,
    },
  )
}

/**
 * 指定リソースを参照整合性制約違反のため削除できない場合のHTTPレスポンス情報です。
 * @return HTTPレスポンス
 */
export const unprocessableEntityResponse = () => {
  return new NextResponse(JSON.stringify({ success: false, message: '関連情報が利用中のため削除できません' }), {
    status: HTTP_STATUS.UNPROCESSABLE_ENTITY,
    headers,
  })
}

/**
 * 該当データが見つからない場合のHTTPレスポンス情報です。
 * @return HTTPレスポンス
 */
export const notFoundResponse = () => {
  return new NextResponse(JSON.stringify({ success: false, message: 'Not Found' }), {
    status: HTTP_STATUS.NOT_FOUND,
    headers,
  })
}
