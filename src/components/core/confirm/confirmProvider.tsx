'use client'

import Confirm from './confirm'
import React, { PropsWithChildren, useState } from 'react'
import ConfirmContext, { ConfirmDialogOptions } from '@/core/contexts/confirmContext'

/**
 * 確認ダイアログProviderです。
 */
const ConfirmProvider = ({ children }: PropsWithChildren) => {
  const [shown, setShown] = useState(false)
  const [loading, setLoading] = useState(false)
  const defaultOptions: ConfirmDialogOptions = {
    title: '確認',
    message: '操作を続けてもよろしいですか?',
    async onConfirm() {
      setShown(false)
    },
  }
  const [confirmDialogOptions, setConfirmDialogOptions] = useState<ConfirmDialogOptions>(defaultOptions)

  const $confirm = (opts?: Partial<ConfirmDialogOptions>) => {
    setShown(true)
    setConfirmDialogOptions({
      message: opts?.message ?? defaultOptions.message,
      onConfirm: opts?.onConfirm ?? defaultOptions.onConfirm,
      title: opts?.title ?? defaultOptions.title,
    })
  }

  const onClose = () => {
    setShown(false)
  }
  const onConfirm = async () => {
    setLoading(true)
    confirmDialogOptions.onConfirm && (await confirmDialogOptions.onConfirm())
    setLoading(false)
    setShown(false)
  }

  return (
    <ConfirmContext.Provider value={{ $confirm }}>
      <Confirm
        open={shown}
        onClose={onClose}
        onConfirm={onConfirm}
        message={confirmDialogOptions.message}
        title={confirmDialogOptions.title}
        confirming={loading}
      />
      {children}
    </ConfirmContext.Provider>
  )
}
export default ConfirmProvider
