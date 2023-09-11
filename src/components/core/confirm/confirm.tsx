'use client'

import React, { ReactNode } from 'react'
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material'
import Button from '@mui/material/Button'

// 確認ダイアログコンポーネントプロパティ
export type Props = {
  // ダイアログが開いているかどうかを示す真偽値
  open: boolean
  //ダイアログのタイトルのReactNode
  title: ReactNode
  // ダイアログに表示するメッセージのReactNode
  message: ReactNode
  // ダイアログを閉じるためのコールバック関数
  onClose(): void
  // ダイアログで「はい」がクリックされたときに実行されるコールバック関数
  onConfirm(): Promise<void> | void
  //（省略可能）trueの場合、確認中を示すローディングスピナーが表示
  confirming?: boolean
}

/**
 * 確認ダイアログコンポーネント
 * @param props プロパティ
 * @constructor
 */
const Confirm = (props: Props) => {
  return (
    <Dialog open={props.open} onClose={() => props.onClose()} fullWidth={true}>
      <DialogTitle>{props.title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{props.message}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.onClose}>いいえ</Button>
        <Button onClick={props.onConfirm} autoFocus>
          はい
        </Button>
      </DialogActions>
    </Dialog>
  )
}
export default Confirm
