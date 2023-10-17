'use client'

import { Edit } from '@refinedev/mui'
import { useForm } from '@refinedev/react-hook-form'
import { HttpError } from '@refinedev/core'
import { AccountManageEditingForm, AccountManageEditingSchema, AccountManageModel } from '@/types'
import React from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import useConfirm from '@/core/hooks/useConfirm'
import { FormSubmitErrorNotification, handleApiError, setTitle } from '@/core/utils/refineUtil'
import { AccountManageSaveForm } from '@/components/domains/accountManages/accountManageSaveForm'

const EditPage: React.FC = () => {
  setTitle()
  const errorNotification = new FormSubmitErrorNotification<AccountManageEditingForm>()
  const {
    saveButtonProps,
    refineCore: { queryResult, formLoading },
    register,
    handleSubmit,
    control,
    formState: { errors },
    setError,
  } = useForm<AccountManageModel, HttpError, AccountManageEditingForm>({
    resolver: zodResolver(AccountManageEditingSchema),
    refineCoreProps: {
      errorNotification: errorNotification.notification,
    },
  })

  if (queryResult) {
    const { error } = queryResult
    handleApiError(error)
  }
  errorNotification.error = setError
  const { $confirm } = useConfirm()

  const handleEdit = (e: any) => {
    $confirm({
      message: '口座情報を更新します。操作を続けてもよろしいですか',
      onConfirm() {
        saveButtonProps.onClick(e)
      },
    })
  }

  return (
    <Edit
      canDelete={false}
      isLoading={formLoading}
      saveButtonProps={{ disabled: saveButtonProps.disabled, onClick: handleSubmit(handleEdit) }}
    >
      <AccountManageSaveForm register={register} queryResult={queryResult} control={control} errors={errors} />
    </Edit>
  )
}
export default EditPage
