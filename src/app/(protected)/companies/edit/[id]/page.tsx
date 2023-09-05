'use client'

import { Box, TextField } from '@mui/material'
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

  const handleEdit = (e: React.BaseSyntheticEvent | any) => {
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
      <Box component='form' sx={{ display: 'flex', flexDirection: 'column' }} autoComplete='off'>
        <TextField
          {...register('name')}
          label='会社名'
          placeholder='XXX株式会社'
          error={!!errors.name}
          helperText={errors.name?.message}
        />
        <TextField
          {...register('postalCode')}
          label='郵便番号'
          placeholder='1030027'
          error={!!errors.postalCode}
          helperText={'ハイフンなしで入力 ' + (errors.postalCode?.message || '')}
        />
        <TextField
          {...register('address1')}
          label='住所1'
          placeholder='東京都中央区日本橋浜町2-6-1'
          error={!!errors.address1}
          helperText={'住所を入力 ' + (errors.address1?.message || '')}
        />
        <TextField
          {...register('address2')}
          label='住所2'
          placeholder='浜町パルクビル3階'
          error={!!errors.address2}
          helperText={'住所1に収まらない場合に入力 ' + (errors.address2?.message || '')}
        />
        <TextField
          {...register('telephone')}
          label='電話番号'
          placeholder='0362062657'
          error={!!errors.telephone}
          helperText={'ハイフンなしで入力 ' + (errors.telephone?.message || '')}
        />
        <TextField
          {...register('fax')}
          label='電話番号'
          placeholder='0362310529'
          error={!!errors.fax}
          helperText={'ハイフンなしで入力 ' + (errors.fax?.message || '')}
        />
      </Box>
    </Edit>
  )
}
export default EditPage
