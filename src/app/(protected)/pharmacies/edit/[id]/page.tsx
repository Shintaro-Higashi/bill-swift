'use client'

import { Edit } from '@refinedev/mui'
import { useForm } from '@refinedev/react-hook-form'
import { HttpError } from '@refinedev/core'
import { PharmacyEditingForm, PharmacyEditingSchema, PharmacyModel } from '@/types'
import React from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import useConfirm from '@/core/hooks/useConfirm'
import { handleApiError, setTitle } from '@/core/utils/refineUtil'
import { PharmacySaveForm } from '@components/domains/pharmacies/pharmacySaveForm'

const EditPage: React.FC = () => {
  setTitle()
  const {
    saveButtonProps,
    refineCore: { queryResult, formLoading },
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<PharmacyModel, HttpError, PharmacyEditingForm>({
    resolver: zodResolver(PharmacyEditingSchema),
  })

  if (queryResult) {
    const { error } = queryResult
    handleApiError(error)
  }

  const { $confirm } = useConfirm()

  const handleEdit = (e: any) => {
    $confirm({
      message: '店舗を編集します。操作を続けてもよろしいですか',
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
      <PharmacySaveForm register={register} queryResult={queryResult} control={control} errors={errors} />
    </Edit>
  )
}
export default EditPage
