import { HTTP_STATUS } from '@/core/configs/constants'
import { HttpError, OpenNotificationParams } from '@refinedev/core'
import { FieldValues, UseFormSetError } from 'react-hook-form'
import { notFound } from 'next/navigation'

/**
 * ページタイトルを設定します。
 * @param title
 */
export const setTitle = (title?: string) => {
  document.title = 'bill-swift'
  /*
  const { resource, identifier, action } = useResource()
  if (!resource) {
    document.title = 'bill-swift'
    return
  }
  if (title) {
    document.title = title + ' | bill-swift'
    return
  }

  const translate = useTranslate()

  const key = `${identifier}.titles.${action}`
  const translateTitle = translate(key)
  document.title = translateTitle + ' | bill-swift'
   */
}

/**
 * 検索条件フォームエラーの通知制御を管理します。
 */
export class QueryFormErrorNotification<TFieldValues extends FieldValues> {
  private setError: UseFormSetError<TFieldValues> | undefined

  // constructor(setError?: UseFormSetError<TFieldValues>) {
  //   this.setError = setError
  // }

  set error(setError: UseFormSetError<TFieldValues>) {
    this.setError = setError
  }

  public notification = (data: HttpError | undefined): OpenNotificationParams | false => {
    // ※アロー関数の理由: メソッドを参照だけして呼び出しが後なのでthis消失問題を回避するため

    // ログイン画面へそのまま遷移するためtoastは表示しない
    if (data?.statusCode === HTTP_STATUS.UNAUTHORIZED) {
      return false
    }
    if (data?.statusCode === HTTP_STATUS.FORBIDDEN) {
      return {
        message: `ユーザ種別を確認して必要な権限があるかをご確認ください`,
        description: 'アクセス権限がありません',
        type: 'error',
      }
    }
    if (data?.statusCode === HTTP_STATUS.BAD_REQUEST && this.setError) {
      for (const error of data.response?.data.error) {
        this.setError(error.path[0], { type: 'server', message: error.message })
      }

      return {
        message: `検索条件に入力エラーがあります`,
        description: '検索条件の不備',
        type: 'error',
      }
    }

    return {
      message: `システム・環境の不備により検索を正常に実行できませんでした`,
      description: '検索に失敗しました',
      type: 'error',
    }
  }
}

/**
 * 各pageコンポーネントから利用するAPI実行結果向けのエラーハンドラです。
 * <pre>
 *  一覧検索以外の
 * <pre>
 * @param error
 */
export const handleApiError = (error: unknown) => {
  if ((error as any)?.statusCode === HTTP_STATUS.NOT_FOUND) {
    notFound()
  }
  if ((error as any)?.statusCode === HTTP_STATUS.INTERNAL_SERVER_ERROR) {
    throw new Error('handleApiError')
  }
}
