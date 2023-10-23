'use client'

/**
 * 患者変更内容のviewTypeがdiffの時に利用する差分表示ダイアログです。
 * <pre>
 *  Contextを利用して差分情報の受け渡しおよびダイアログの表示を行います。
 * </pre>
 */
import React, { createContext, PropsWithChildren, useContext, useState } from 'react'
import { Box, Modal } from '@mui/material'
import ReactDiffViewer from 'react-diff-viewer-continued'
import { ThemeContext } from '@/core/contexts/themeContext'

/**
 * 差分表示ダイアログOptions
 */
type DiffContentDialogOptions = {
  content?: { old: string | null; new: string | null }
}

/**
 * 差分表示ダイアログに差分内容を引き渡すためのContext定義
 */
export const DiffContentDialogContext = createContext<{
  /**
   * 差分表示ダイアログを表示します。
   * @param opts 表示オプション
   */
  $openDiffDialog(opts: DiffContentDialogOptions): void
} | null>(null)

/**
 * 差分表示ダイアログProviderです。
 */
export const DiffContentDialogProvider = ({ children }: PropsWithChildren) => {
  const [shown, setShown] = useState(false)

  const [diffContentDialogOptions, setDiffContentDialogOptions] = useState<DiffContentDialogOptions>({})

  const $openDiffDialog = (opts: DiffContentDialogOptions) => {
    setDiffContentDialogOptions({
      content: opts.content,
    })
    setShown(true)
  }

  const onClose = () => {
    setShown(false)
  }

  return (
    <DiffContentDialogContext.Provider value={{ $openDiffDialog }}>
      <DiffContentDialog open={shown} onClose={onClose} content={diffContentDialogOptions?.content} />
      {children}
    </DiffContentDialogContext.Provider>
  )
}

const diffContentDialogStyle = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  maxWidth: '80%',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  maxHeight: 500,
  overflowY: 'auto',
}

type Props = {
  open: boolean
  onClose: () => void
  content?: { old: string | null; new: string | null }
}

const DiffContentDialog = (props: Props) => {
  const { open, onClose, content } = props
  const { mode } = useContext(ThemeContext)
  return (
    <Modal open={open} onClose={onClose} aria-labelledby='modal-modal-title' aria-describedby='modal-modal-description'>
      <Box sx={diffContentDialogStyle}>
        <ReactDiffViewer
          leftTitle='変更前'
          rightTitle='変更後'
          oldValue={content?.old ?? ''}
          newValue={content?.new ?? ''}
          splitView={true}
          showDiffOnly={false}
          useDarkTheme={mode === 'dark'}
        />
      </Box>
    </Modal>
  )
}

/**
 * 差分表示ダイアログを操作するHook処理です。
 * <pre>
 *  使用例:
 *  const { $openDiffDialog } = useDiffContentDialog()
 *   $openDiffDialog({
 *     content: {old:'123', new:'125'},
 *   })
 * </pre>
 */
const useDiffContentDialog = () => {
  const context = useContext(DiffContentDialogContext)
  if (!context) {
    throw new Error('DiffContentDialogProviderが親コンポーネントに定義されていません')
  }
  return context
}

export default useDiffContentDialog
