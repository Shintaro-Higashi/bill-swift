import { FieldErrors, UseFormRegister, Controller, Control } from 'react-hook-form'
import { CompanyCreationForm, CompanyEditingForm, CompanyModel } from '@/types'
import { Box, TextField } from '@mui/material'
import React from 'react'
import { GetOneResponse } from '@refinedev/core/src/interfaces'
import { QueryObserverResult } from '@tanstack/query-core/build/lib/types'
import { ControlAutocomplete } from '@/components/core/form/controlAutocomplete'
import { ControlItemAutocomplete } from '@/components/core/form/controlItemAutocomplete'
import { ACCOUNT_TYPE_LIST } from '@/shared/items/accountType'

// 会社作成、編集フォームプロパティ
type Props = {
  /** 会社作成、編集入力フィールド情報 */
  register: UseFormRegister<CompanyCreationForm | CompanyEditingForm>
  /** クエリ結果情報 */
  queryResult?: QueryObserverResult<GetOneResponse<CompanyModel>> | undefined
  /** コントローラー情報 */
  control: Control<CompanyCreationForm | CompanyEditingForm>
  /** フォーム入力エラー情報 */
  errors: FieldErrors<CompanyCreationForm | CompanyEditingForm>
}

/**
 * 会社作成、編集フォームです。
 */
export const CompanySaveForm = (props: Props) => {
  const { register, queryResult, control, errors } = props
  const postsData = queryResult ? queryResult.data?.data : undefined

  return (
    <Box component='form' sx={{ display: 'flex', flexDirection: 'column' }} autoComplete='off'>
      <TextField
        required
        {...register('name')}
        label='名称'
        placeholder='XXX株式会社'
        error={!!errors.name}
        helperText={errors.name?.message}
      />
      <TextField
        required
        {...register('nameKana')}
        label='カナ名称'
        placeholder='XXXカブシキガイシャ'
        error={!!errors.nameKana}
        helperText={errors.nameKana?.message}
      />
      <TextField
        required
        {...register('postalCode')}
        label='郵便番号'
        placeholder='103-0027'
        error={!!errors.postalCode}
        helperText={'ハイフン付きで入力 ' + (errors.postalCode?.message || '')}
      />
      <TextField
        required
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
        required
        {...register('tel')}
        label='電話番号'
        placeholder='03-6206-2657'
        error={!!errors.tel}
        helperText={'ハイフン付きで入力 ' + (errors.tel?.message || '')}
      />
      <TextField
        {...register('fax')}
        label='FAX番号'
        placeholder='03-6231-0529'
        error={!!errors.fax}
        helperText={'ハイフン付きで入力 ' + (errors.fax?.message || '')}
      />
      <TextField
        {...register('invoiceNo')}
        label='インボイス登録番号'
        placeholder='T0000000000000'
        error={!!errors.invoiceNo}
        helperText={errors.invoiceNo?.message}
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
      <ControlAutocomplete
        required
        resource='healthFacilityCodeGroups'
        label='施設コードグループ'
        name='healthFacilityCodeGroupId'
        defaultId={postsData?.healthFacilityCodeGroupId}
        control={control}
        error={!!errors.healthFacilityCodeGroupId}
        helperText={errors.healthFacilityCodeGroupId?.message}
      />
    </Box>
  )
}
