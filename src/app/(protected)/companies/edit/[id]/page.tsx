'use client'

import { Edit } from '@refinedev/mui'
import { useForm } from '@refinedev/react-hook-form'
import { HttpError } from '@refinedev/core'
import { CompanyEditingForm, CompanyEditingSchema, CompanyModel } from '@/types'
import React from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import useConfirm from '@/core/hooks/useConfirm'
import { notFound } from 'next/navigation'
import { HTTP_STATUS } from '@/core/configs/constants'
import { setTitle } from '@/core/utils/refineUtil'
import { CompanySaveForm } from '@components/domains/companies/companySaveForm'

const EditPage: React.FC = () => {
  setTitle()
  const {
    saveButtonProps,
    refineCore: { queryResult, formLoading },
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CompanyModel, HttpError, CompanyEditingForm>({
    resolver: zodResolver(CompanyEditingSchema),
  })

  if (queryResult) {
    const { error } = queryResult
    if ((error as any)?.statusCode === HTTP_STATUS.NOT_FOUND) {
      notFound()
    }
  }

  const { $confirm } = useConfirm()

  const handleEdit = (e: any) => {
    $confirm({
      message: '会社を編集します。操作を続けてもよろしいですか',
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
      <CompanySaveForm register={register} errors={errors} />
    </Edit>
  )
}
export default EditPage
