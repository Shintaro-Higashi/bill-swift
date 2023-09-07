'use client'

import { TextField, TextFieldProps } from '@mui/material'
import React from 'react'

type OmittedProps = 'variant'
type Props = Omit<TextFieldProps, OmittedProps> & {}

/**
 * 詳細画面などで利用する項目名と項目値を出力します。
 */
export const FieldItem = (props: Props) => {
  return <TextField {...props} value={props.value || ''} variant='standard' margin='dense' />
}
