import { useContext } from 'react'
import ConfirmContext from '@/core/contexts/confirmContext'

/**
 * 確認ダイアログを操作するHook処理です。
 * <pre>
 *  使用例:
 *  const { $confirm } = useConfirm()
 *   $confirm({
 *     message: '会社を新規作成します',
 *     onConfirm() {
 *       console.log('確認ダイアログのはいを押下')
 *     },
 *   })
 * </pre>
 */
const useConfirm = () => {
  const context = useContext(ConfirmContext)
  if (!context) {
    throw new Error('ConfirmDialogProviderが親コンポーネントに定義されていません')
  }
  return context
}

export default useConfirm
