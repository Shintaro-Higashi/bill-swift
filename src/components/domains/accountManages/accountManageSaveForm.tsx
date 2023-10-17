import { Control, FieldErrors, UseFormRegister } from 'react-hook-form'
import { AccountManageCreationForm, AccountManageEditingForm, AccountManageModel } from '@/types'
import { Box, TextField } from '@mui/material'
import React from 'react'
import { GetOneResponse, useResource } from '@refinedev/core'
import { QueryObserverResult } from '@tanstack/query-core'
import { ControlItemAutocomplete } from '@/components/core/form/controlItemAutocomplete'
import { ACCOUNT_TYPE_LIST } from '@/shared/items/accountType'

// 口座管理作成・編集フォームプロパティ
type Props = {
  /** 口座管理作成・編集入力フィールド情報 */
  register: UseFormRegister<AccountManageCreationForm | AccountManageEditingForm>
  /** クエリ結果情報 */
  queryResult?: QueryObserverResult<GetOneResponse<AccountManageModel>> | undefined
  /** コントローラー情報 */
  control: Control<AccountManageCreationForm | AccountManageEditingForm>
  /** フォーム入力エラー情報 */
  errors: FieldErrors<AccountManageCreationForm | AccountManageEditingForm>
}

/**
 * 口座管理作成・編集フォームです。
 */
export const AccountManageSaveForm = (props: Props) => {
  const { register, queryResult, control, errors } = props
  const postsData = queryResult ? queryResult.data?.data : undefined

  const { action } = useResource()

  return (
    <Box component='form' sx={{ display: 'flex', flexDirection: 'column' }} autoComplete='off'>
      <TextField
        required
        {...register('name')}
        label='名称'
        placeholder='金融機関名 会社名'
        error={!!errors.name}
        helperText={errors.name?.message}
      />
      <TextField
        {...register('transferDate')}
        label='振込日'
        placeholder='27'
        error={!!errors.transferDate}
        helperText={errors.transferDate?.message}
      />
      <TextField
        {...register('financialCode')}
        label='金融機関コード'
        placeholder='0000'
        error={!!errors.financialCode}
        helperText={errors.financialCode?.message}
      />
      <TextField
        {...register('financialName')}
        label='金融機関名'
        placeholder='XXX銀行'
        error={!!errors.financialName}
        helperText={errors.financialName?.message}
      />
      <TextField
        {...register('branchCode')}
        label='支店コード'
        placeholder='000'
        error={!!errors.branchCode}
        helperText={errors.branchCode?.message}
      />
      <TextField
        {...register('branchName')}
        label='支店名称'
        placeholder='XXX支店'
        error={!!errors.branchName}
        helperText={errors.branchName?.message}
      />
      <ControlItemAutocomplete
        label='口座種別'
        name='accountType'
        options={ACCOUNT_TYPE_LIST}
        control={control}
        error={!!errors.accountType}
        helperText={errors.accountType?.message}
      />
      <TextField
        {...register('accountNo')}
        label='口座番号'
        placeholder='0000000'
        error={!!errors.accountNo}
        helperText={errors.accountNo?.message}
      />
      <TextField
        {...register('accountName')}
        label='口座名義'
        placeholder=''
        error={!!errors.accountName}
        helperText={errors.accountName?.message}
      />
    </Box>
  )
}
