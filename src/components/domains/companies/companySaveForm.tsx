import { FieldErrors, UseFormRegister } from 'react-hook-form'
import { CompanyCreationForm, CompanyEditingForm } from '@/types'
import { Box, TextField } from '@mui/material'
import React from 'react'

// 会社作成、編集フォームプロパティ
type Props = {
  /** 会社作成、編集入力フィールド情報 */
  register: UseFormRegister<CompanyCreationForm | CompanyEditingForm>
  // フォーム入力エラー情報
  errors: FieldErrors<CompanyCreationForm | CompanyEditingForm>
}

/**
 * 会社作成、編集フォームです。
 */
export const CompanySaveForm = (props: Props) => {
  const { register, errors } = props
  return (
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
        {...register('tel')}
        label='電話番号'
        placeholder='0362062657'
        error={!!errors.tel}
        helperText={'ハイフンなしで入力 ' + (errors.tel?.message || '')}
      />
      <TextField
        {...register('fax')}
        label='FAX番号'
        placeholder='0362310529'
        error={!!errors.fax}
        helperText={'ハイフンなしで入力 ' + (errors.fax?.message || '')}
      />
    </Box>
  )
}
