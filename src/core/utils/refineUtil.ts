import { HTTP_STATUS } from '@/core/configs/constants'
import { HttpError, useResource, useTranslate } from '@refinedev/core'
import { UseFormSetError } from 'react-hook-form'
import { OpenNotificationParams } from '@refinedev/core/src/interfaces'
import { FieldValues } from 'react-hook-form/dist/types/fields'

/**
 * ページタイトルを設定します。
 * @param title
 */
export const setTitle = (title?: string) => {
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

  public notification = (data: HttpError | undefined): OpenNotificationParams => {
    // ※アロー関数の理由: メソッドを参照だけして呼び出しが後なのでthis消失問題を回避するため
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
      message: `正常に検索を実地できませんでした`,
      description: 'Error',
      type: 'error',
    }
  }
}