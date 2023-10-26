import * as React from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'

/**
 * プロパティ型定義
 */
type Props = {
  /** ダイアログを開くためのボタンをレンダリングする関数 */
  renderOpenDialogButton: (openDialog: () => void) => React.ReactElement
  /** ダイアログのタイトル */
  title: string
  /** ダイアログのコンテンツ */
  content: React.ReactElement
  /** 保存ボタンをレンダリングする関数 */
  renderSaveButton: (closeDialog: () => void) => React.ReactElement
  /** キャンセルボタンをレンダリングする関数 */
  renderCancelButton?: (closeDialog: () => void) => React.ReactElement
}

/**
 * MUIのDialogを利用し、シンプルなダイアログをレンダリングするコンポーネントです。
 * ダイアログ実装のコードを簡略化できます。
 *
 * 使用例：施設で利用する担当店舗変更ダイアログを展開するボタンを設置
 * <pre>
 *   <BasicDialog
 *     title='担当店舗の変更'
 *     content={<AssignedPharmacySaveForm />}
 *     renderOpenDialogButton={(openDialog) => (
 *       <Button variant='contained' startIcon={<ModeEditOutlineOutlinedIcon />} onClick={() => {
 *         ...something save action
 *         openDialog
 *       }}>
 *         変更
 *       </Button>
 *     )}
 *     renderSaveButton={(closeDialog) => (
 *       <Button variant='contained' startIcon={<SaveOutlinedIcon />} onClick={closeDialog}>
 *         保存
 *       </Button>
 *     )}
 *   />
 *  </pre>
 */

export const BasicDialog = (props: Props) => {
  const {
    renderOpenDialogButton,
    title,
    content,
    renderSaveButton,
    renderCancelButton = (closeDialog) => (
      <Button variant='outlined' onClick={closeDialog}>
        キャンセル
      </Button>
    ),
  } = props

  const [dialogOpen, setDialogOpen] = React.useState(false)
  const handleOpenDialog = () => {
    setDialogOpen(true)
  }
  const handleCloseDialog = () => {
    setDialogOpen(false)
  }

  return (
    <div>
      {renderOpenDialogButton(handleOpenDialog)}
      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>{content}</DialogContent>
        <DialogActions>
          {renderCancelButton(handleCloseDialog)}
          {renderSaveButton(handleCloseDialog)}
        </DialogActions>
      </Dialog>
    </div>
  )
}
