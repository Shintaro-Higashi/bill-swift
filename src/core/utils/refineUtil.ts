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
 * refineが提供するuseFormの通知制御を定義します。
 * <pre>
 *  refine標準の通知制御ではできないサーバサイドで発生したバリデーションエラーを各入力項目に反映することができます。
 * </pre>
 */
export class FormSubmitErrorNotification<TFieldValues extends FieldValues> {
  // react-hook-form のuseForm結果のsetError
  private setError: UseFormSetError<TFieldValues> | undefined

  // 422バリデーションエラー発生時のエラーメッセージ
  private static readonly BAD_REQUEST_MESSAGE = {
    get: {
      message: `検索条件に入力エラーがあります`,
      description: '検索条件の不備',
    },
    patch: {
      message: `フォーム項目に入力エラーがあります`,
      description: '入力内容の不備',
    },
    post: {
      message: `フォーム項目に入力エラーがあります`,
      description: '入力内容の不備',
    },
  }

  // その他エラー発生時のエラーメッセージ
  private static readonly INTERNAL_SERVER_ERROR_MESSAGE = {
    get: {
      message: `検索条件に入力エラーがあります`,
      description: '検索条件の不備',
    },
    post: {
      message: `フォーム項目に入力エラーがあります`,
      description: '入力内容の不備',
    },
    patch: {
      message: `フォーム項目に入力エラーがあります`,
      description: '入力内容の不備',
    },
  }

  set error(setError: UseFormSetError<TFieldValues>) {
    this.setError = setError
  }

  /**
   * フォームSubmit結果にエラーが発生した時の通知内容です。
   *
   * @param data RestAPI結果
   */
  public notification = (data: HttpError | undefined): OpenNotificationParams | false => {
    // ※アロー関数の理由: メソッドを参照だけして呼び出しが後なのでアローにしないとthis消失問題が発生する
    const method = data?.config?.method as 'get' | 'patch' | 'post'
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
        ...FormSubmitErrorNotification.BAD_REQUEST_MESSAGE[method || 'get'],
        type: 'error',
      }
    }

    return {
      ...FormSubmitErrorNotification.INTERNAL_SERVER_ERROR_MESSAGE[method || 'get'],
      type: 'error',
    }
  }
}

/**
 * 詳細画面や更新画面などの詳細情報API取得結果に対して利用するエラーハンドラです。
 *
 * @param error APIエラー結果
 */
export const handleApiError = (error: unknown) => {
  if ((error as any)?.statusCode === HTTP_STATUS.NOT_FOUND) {
    notFound()
  }
  if ((error as any)?.statusCode === HTTP_STATUS.INTERNAL_SERVER_ERROR) {
    throw new Error('handleApiError')
  }
}

/**
 * 最新に更新ボタンを取得します
 */
export const getRefineRefreshButton = () => {
  const buttons = document.querySelectorAll('.MuiCardHeader-action button') as NodeListOf<HTMLButtonElement>
  if (buttons.length === 0) return null
  return buttons[buttons.length - 1]
}
