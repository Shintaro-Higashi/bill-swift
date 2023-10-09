import { FieldErrors, UseFormRegister, Control } from 'react-hook-form'
import { PharmacyCreationForm, PharmacyEditingForm, PharmacyModel } from '@/types'
import { Box, TextField } from '@mui/material'
import React from 'react'

import { ControlAutocomplete } from '@/components/core/form/controlAutocomplete'
import { QueryObserverResult } from '@tanstack/query-core'
import { GetOneResponse } from '@refinedev/core'

// 店舗作成、編集フォームプロパティ
type Props = {
  /** 店舗作成、編集入力フィールド情報 */
  register: UseFormRegister<PharmacyCreationForm | PharmacyEditingForm>
  /** クエリ結果情報 */
  queryResult?: QueryObserverResult<GetOneResponse<PharmacyModel>> | undefined
  /** コントローラー情報 */
  control: Control<PharmacyCreationForm | PharmacyEditingForm>
  /** フォーム入力エラー情報 */
  errors: FieldErrors<PharmacyCreationForm | PharmacyEditingForm>
}

/**
 * 店舗作成、編集フォームです。
 */
export const PharmacySaveForm = (props: Props) => {
  const { register, queryResult, control, errors } = props
  const postsData = queryResult ? queryResult.data?.data : undefined

  return (
    <Box component='form' sx={{ display: 'flex', flexDirection: 'column' }} autoComplete='off'>
      <ControlAutocomplete
        required
        resource='companies'
        label='会社名'
        name='companyId'
        defaultId={postsData?.companyId}
        control={control}
        error={!!errors.companyId}
        helperText={errors.companyId?.message}
      />
      <ControlAutocomplete
        required
        resource='pharmacyGroups'
        label='薬局名'
        name='pharmacyGroupId'
        defaultId={postsData?.pharmacyGroupId}
        control={control}
        error={!!errors.pharmacyGroupId}
        helperText={errors.pharmacyGroupId?.message}
      />
      <TextField
        required
        {...register('name')}
        label='店舗名称'
        placeholder=''
        error={!!errors.name}
        helperText={errors.name?.message}
      />
      <TextField
        required
        {...register('nameKana')}
        label='店舗カナ名称'
        placeholder=''
        error={!!errors.nameKana}
        helperText={errors.nameKana?.message}
      />
      <TextField
        {...register('medicalInstitutionCode')}
        label='医療機関コード'
        placeholder=''
        error={!!errors.medicalInstitutionCode}
        helperText={errors.medicalInstitutionCode?.message}
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
    </Box>
  )
}
