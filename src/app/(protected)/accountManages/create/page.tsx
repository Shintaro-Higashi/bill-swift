'use client'

import { Create } from '@refinedev/mui'
import { useForm } from '@refinedev/react-hook-form'
import { BaseRecord, HttpError } from '@refinedev/core'
import { AccountManageCreationForm, AccountManageCreationSchema } from '@/types'
import React from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import useConfirm from '@/core/hooks/useConfirm'
import { FormSubmitErrorNotification, setTitle } from '@/core/utils/refineUtil'
import { AccountManageSaveForm } from '@/components/domains/accountManages/accountManageSaveForm'

const CreatePage: React.FC = () => {
  setTitle()
  const errorNotification = new FormSubmitErrorNotification<AccountManageCreationForm>()
  const {
    saveButtonProps,
    refineCore: { formLoading },
    register,
    handleSubmit,
    control,
    formState: { errors },
    setError,
  } = useForm<BaseRecord, HttpError, AccountManageCreationForm>({
    resolver: zodResolver(AccountManageCreationSchema),
    refineCoreProps: {
      errorNotification: errorNotification.notification,
    },
  })
  errorNotification.error = setError
  const { $confirm } = useConfirm()

  const handleCreate = (e: React.BaseSyntheticEvent | any) => {
    $confirm({
      message: '口座情報を登録します。操作を続けてもよろしいですか',
      onConfirm() {
        saveButtonProps.onClick(e)
      },
    })
  }

  return (
    <Create
      isLoading={formLoading}
      saveButtonProps={{ disabled: saveButtonProps.disabled, onClick: handleSubmit(handleCreate) }}
    >
      <AccountManageSaveForm register={register} control={control} errors={errors} />
    </Create>
  )
}
export default CreatePage
