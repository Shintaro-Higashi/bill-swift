import { Controller, Control } from 'react-hook-form'
import React from 'react'
import { TextField, Autocomplete } from '@mui/material'

/**
 * ControlItemAutocompleteプロパティ
 */
type Props = {
  /** 必須項目 */
  required?: boolean
  /** 表示名 */
  label: string
  /** フィールド名 */
  name: string
  /** オプションオブジェクト */
  options: any[]
  /** コントローラー情報 */
  control: Control<any>
  /** エラー情報 */
  error: boolean
  /** 入力補助テキスト */
  helperText: string | undefined
  /** 禁則 */
  disabled?: boolean
}

/**
 *
 * ※※※　サーバーの問い合わせが不要な場合は、こちらのControlItemAutocompleteを仕様してください。※※※
 *
 * MUIのAutoCompleteをReact Hook Formと組み合わせて利用する場合に利用するWrapperComponentです。
 * 通常のControl + Autocomplete を定義するよりも簡易に記述することが可能です。
 *
 * ※optionsには、{key: string, value: string}の形式で値を設定してください。
 *
 * 使用例：口座種別オプションを設定（実際はオブジェクトの定義をsrc/shared/items/で行う）
 * <pre>
 * const ACCOUNT_TYPE = { '0': '普通', '1': '当座' } as const
 * <ControlItemAutocomplete
 *   label='口座種別'
 *   name='accountType'
 *   options={ACCOUNT_TYPE_LIST}
 *   control={control}
 *   error={!!errors.accountType}
 *   helperText={errors.accountType?.message}
 * />
 * </pre>
 */

export const ControlItemAutocomplete = (props: Props) => {
  const { required, label, name, options, control, error, helperText, disabled } = props

  return (
    <Controller
      control={control}
      name={name}
      defaultValue={null as any}
      render={({ field }) => (
        <Autocomplete
          disabled={disabled}
          value={options.find((item) => item.key === field.value) ?? null}
          options={options}
          onChange={(_, value) => {
            field.onChange(value?.key)
          }}
          getOptionLabel={(item) => {
            return item?.value ?? ''
          }}
          renderOption={(props, option) => {
            return (
              <li {...props} key={option.key}>
                {option.value}
              </li>
            )
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              required={required}
              label={label}
              error={error}
              helperText={helperText}
              InputLabelProps={{ shrink: true }}
            />
          )}
        />
      )}
    />
  )
}
