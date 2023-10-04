'use client'

import { Create } from '@refinedev/mui'
import { useForm } from '@refinedev/react-hook-form'
import { BaseRecord, HttpError } from '@refinedev/core'
import { PharmacyCreationForm, PharmacyCreationSchema } from '@/types'
import React from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import useConfirm from '@/core/hooks/useConfirm'
import { setTitle } from '@/core/utils/refineUtil'
import { PharmacySaveForm } from '@/components/domains/pharmacies/pharmacySaveForm'

const CreatePage: React.FC = () => {
  setTitle()
  const {
    saveButtonProps,
    refineCore: { formLoading },
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<BaseRecord, HttpError, PharmacyCreationForm>({
    resolver: zodResolver(PharmacyCreationSchema),
  })

  const { $confirm } = useConfirm()

  const handleCreate = (e: React.BaseSyntheticEvent | any) => {
    $confirm({
      message: '店舗を新規作成します。操作を続けてもよろしいですか',
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
      <PharmacySaveForm register={register} control={control} errors={errors} />
    </Create>
  )
}
export default CreatePage
