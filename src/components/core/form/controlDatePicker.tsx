import { Controller, Control } from 'react-hook-form'
import React from 'react'
import { DatePicker } from '@mui/x-date-pickers'
import { formatDate } from '@/core/utils/dateUtil'

/**
 * ControlDatePickerプロパティ
 */
type Props = {
  /** 必須項目 */
  required?: boolean
  /** 表示名 */
  label: string
  /** フィールド名 */
  name: string
  /** コントローラー情報 */
  control: Control<any>
  /** エラー情報 */
  error: boolean
  /** 入力補助テキスト */
  helperText: string | undefined
  /** 禁則 */
  disabled?: boolean
  /** 読み取り専用有無 */
  readOnly?: boolean
  /** 過去日を無効に */
  disablePast?: boolean
}

/**
 * MUIのDatePickerをReact Hook Formと組み合わせる場合に利用するWrapperComponentです。
 * 通常のControl + DatePicker を定義するよりも簡易に記述することが可能です。
 *
 * ※フォーマットは"YYYY/MM/DD"以外想定されない為、変更不可の仕様です。
 *
 * 使用例：
 * <pre>
 *   <ControlDatePicker
 *     required
 *     label='対応開始日'
 *     name='startDate'
 *     control={control}
 *     error={!!errors.startDate}
 *     helperText={'本日以降の日付のみ変更可能 ' + (errors.startDate?.message || '')}
 *     readOnly={startDateReadOnly}
 *     disablePast
 *   />
 * </pre>
 */

export const ControlDatePicker = (props: Props) => {
  const { required, label, name, control, error, helperText, disabled = false, readOnly, disablePast } = props

  return (
    <Controller
      control={control}
      name={name}
      defaultValue={null}
      render={({ field }) => {
        return (
          <DatePicker
            label={label}
            disabled={disabled}
            value={field.value}
            onChange={(newValue) => {
              return field.onChange(newValue)
            }}
            readOnly={readOnly}
            disablePast={disablePast}
            slotProps={{
              textField: {
                required: required,
                error: error,
                helperText: helperText,
              },
            }}
          />
        )
      }}
    />
  )
}
