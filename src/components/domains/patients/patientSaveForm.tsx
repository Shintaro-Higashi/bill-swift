import { Control, FieldErrors, UseFormRegister } from 'react-hook-form'
import { PatientCreationForm, PatientEditingForm, PatientModel } from '@/types'
import { Box } from '@mui/material'
import React from 'react'
import { GetOneResponse } from '@refinedev/core'
import { QueryObserverResult } from '@tanstack/query-core'
// 会社作成、編集フォームプロパティ
type Props = {
  /** 患者作成、編集入力フィールド情報 */
  register: UseFormRegister<PatientCreationForm | PatientEditingForm>
  /** クエリ結果情報 */
  queryResult?: QueryObserverResult<GetOneResponse<PatientModel>> | undefined
  /** コントローラー情報 */
  control: Control<PatientCreationForm | PatientEditingForm>
  /** フォーム入力エラー情報 */
  errors: FieldErrors<PatientCreationForm | PatientEditingForm>
}

/**
 * 患者作成、編集フォームです。
 */
export const PatientSaveForm = (props: Props) => {
  const { register, queryResult, control, errors } = props
  const patient = queryResult ? queryResult.data?.data : undefined

  return (
    <Box component='form' sx={{ display: 'flex', flexDirection: 'column' }} autoComplete='off'>
      開発中。。
    </Box>
  )
}
