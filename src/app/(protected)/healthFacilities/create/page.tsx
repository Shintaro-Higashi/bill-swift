'use client'

import { Create } from '@refinedev/mui'
import { useForm } from '@refinedev/react-hook-form'
import { BaseRecord, HttpError } from '@refinedev/core'
import { HealthFacilityCreationForm, HealthFacilityCreationSchema } from '@/types'
import React from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import useConfirm from '@/core/hooks/useConfirm'
import { FormSubmitErrorNotification, setTitle } from '@/core/utils/refineUtil'
import { HealthFacilitySaveForm } from '@components/domains/healthFacilities/healthFacilitySaveForm'

const CreatePage: React.FC = () => {
  setTitle()
  const errorNotification = new FormSubmitErrorNotification<HealthFacilityCreationForm>()
  const {
    saveButtonProps,
    refineCore: { formLoading },
    register,
    handleSubmit,
    control,
    formState: { errors },
    setError,
  } = useForm<BaseRecord, HttpError, HealthFacilityCreationForm>({
    resolver: zodResolver(HealthFacilityCreationSchema),
    refineCoreProps: {
      errorNotification: errorNotification.notification,
    },
  })
  errorNotification.error = setError
  const { $confirm } = useConfirm()

  const handleCreate = (e: React.BaseSyntheticEvent | any) => {
    $confirm({
      message: '施設を新規作成します。操作を続けてもよろしいですか',
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
      <HealthFacilitySaveForm register={register} control={control} errors={errors} />
    </Create>
  )
}
export default CreatePage
