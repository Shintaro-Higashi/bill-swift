'use client'

import { Edit } from '@refinedev/mui'
import { useForm } from '@refinedev/react-hook-form'
import { HttpError } from '@refinedev/core'
import { HealthFacilityEditingForm, HealthFacilityEditingSchema, HealthFacilityModel } from '@/types'
import React, { useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import useConfirm from '@/core/hooks/useConfirm'
import { FormSubmitErrorNotification, handleApiError, setTitle } from '@/core/utils/refineUtil'
import { HealthFacilitySaveForm } from '@components/domains/healthFacilities/healthFacilitySaveForm'

const EditPage: React.FC = () => {
  setTitle()
  const errorNotification = new FormSubmitErrorNotification<HealthFacilityEditingForm>()
  const {
    saveButtonProps,
    refineCore: { queryResult, formLoading },
    register,
    setValue,
    handleSubmit,
    control,
    formState: { errors },
    setError,
  } = useForm<HealthFacilityModel, HttpError, HealthFacilityEditingForm>({
    resolver: zodResolver(HealthFacilityEditingSchema),
  })

  if (queryResult) {
    const { error } = queryResult
    handleApiError(error)
  }

  useEffect(() => {
    const healthFacilityRelatePharmacies = queryResult?.data?.data?.healthFacilityRelatePharmacy ?? []
    if (healthFacilityRelatePharmacies?.length >= 1) {
      setValue('startDate', healthFacilityRelatePharmacies[0].startDate)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryResult?.data?.data?.healthFacilityRelatePharmacy])

  errorNotification.error = setError
  const { $confirm } = useConfirm()

  const handleEdit = (e: any) => {
    $confirm({
      message: '施設を編集します。操作を続けてもよろしいですか',
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
      <HealthFacilitySaveForm register={register} queryResult={queryResult} control={control} errors={errors} />
    </Edit>
  )
}
export default EditPage
