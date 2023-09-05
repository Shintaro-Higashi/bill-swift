'use client'

import { Box, TextField } from '@mui/material'
import { Create } from '@refinedev/mui'
import { useForm } from '@refinedev/react-hook-form'
import { BaseRecord, HttpError } from '@refinedev/core'
import { CompanyCreationForm, CompanyCreationSchema } from '@/types'
import React from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import useConfirm from '@/core/hooks/useConfirm'
import { setTitle } from '@/core/utils/refineUtil'

const CreatePage: React.FC = () => {
  setTitle()
  const {
    saveButtonProps,
    refineCore: { formLoading },
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BaseRecord, HttpError, CompanyCreationForm>({
    resolver: zodResolver(CompanyCreationSchema),
  })

  const { $confirm } = useConfirm()

  const handleCreate = (e: React.BaseSyntheticEvent | any) => {
    $confirm({
      message: '会社を新規作成します。操作を続けてもよろしいですか',
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
    </Create>
  )
}
export default CreatePage
