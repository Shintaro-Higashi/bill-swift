import { createContext, ReactNode } from 'react'

/**
 * 確認ダイアログHook処理パラメータ
 */
export type ConfirmDialogOptions = {
  title?: ReactNode
  message: ReactNode
  onConfirm(): Promise<void> | void
}

const ConfirmContext = createContext<{
  /**
   * 確認ダイアログを表示します。
   * @param opts 表示オプション
   */
  $confirm(opts: ConfirmDialogOptions): void
} | null>(null)

export default ConfirmContext
