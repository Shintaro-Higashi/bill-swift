import { Control, Controller } from 'react-hook-form'
import React from 'react'
import { FormGroup, FormHelperText, Switch } from '@mui/material'
import FormControlLabel from '@mui/material/FormControlLabel'

/**
 * ControlAutocompleteプロパティ（※汎用的なコンポーネントにするため、部分的にanyを利用）
 */
type Props = {
  /** 必須項目 */
  required?: boolean
  /** コントローラー情報 */
  control: Control<any>
  /** 表示名 */
  label: string
  /** フィールド名 */
  name: string
  /** エラー情報 */
  error: boolean
  /** 入力補助テキスト */
  helperText: string | undefined
}

/**
 *
 * MUIのSwitchをReact Hook Formと組み合わせる場合に利用するWrapperComponentです。
 * 通常のControl + Switch を定義するよりも簡易に記述することが可能です。
 *
 * 使用例
 * <pre>
 *  <ControlSwitch
 *     control={control}
 *     name='billDisableFlag'
 *     label='請求不可の患者のみに絞り込む'
 *     error={!!errors.billDisableFlag}
 *     helperText={errors.billDisableFlag?.message}
 *   />
 * />
 * </pre>
 */

export const ControlSwitch = (props: Props) => {
  const { required, label, name, control, error, helperText } = props

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={undefined}
      render={({ field }) => (
        <FormGroup {...field}>
          <FormControlLabel
            control={<Switch required={required} name={name} checked={!!field.value} />}
            label={label}
            value={!!field.value}
          />
          <FormHelperText color={error ? 'error' : 'black'}>{helperText}</FormHelperText>
        </FormGroup>
      )}
    />
  )
}
