'use client'

import React, { PropsWithChildren } from 'react'
import { LocalizationProvider } from '@mui/x-date-pickers'
import ja from 'date-fns/locale/ja'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'

/**
 * MUIのDatePickerの言語翻訳（ローカライズ）用Providerです。
 */
const DatePickerLocalizationProvider = ({ children }: PropsWithChildren) => {
  return (
    <LocalizationProvider
      dateAdapter={AdapterDateFns}
      adapterLocale={ja}
      dateFormats={{ monthAndYear: 'yyyy年MM月' }}
      localeText={{
        previousMonth: '前月を表示',
        nextMonth: '次月を表示',
      }}
    >
      {children}
    </LocalizationProvider>
  )
}
export default DatePickerLocalizationProvider
