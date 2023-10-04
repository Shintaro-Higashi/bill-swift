import { Controller, Control } from 'react-hook-form'
import React from 'react'
import { useAutocomplete } from '@refinedev/mui'
import { TextField, Autocomplete } from '@mui/material'

/**
 * ControlAutocompleteプロパティ（※汎用的なコンポーネントにするため、部分的にanyを利用）
 */
type Props = {
  /** リソース名 */
  resource: string
  /** 表示名 */
  label: string
  /** フィールド名 */
  name: string
  /** 初期値を利用する場合にidを指定(主に編集画面で利用) */
  defaultId?: string
  /** コントローラー情報 */
  control: Control<any>
  /** エラー情報 */
  error: boolean
  /** 入力補助テキスト */
  helperText: string | undefined
  /** オプションの検索値 */
  onSearchField?: string
  /** オプションのラベル */
  optionLabel?: (option: any) => string
}

/**
 * ※※※　Resourceによりサーバーの情報を取得する場合は、こちらのControlAutocompleteを使用してください。※※※
 *
 * MUIのAutoCompleteをReact Hook Formと組み合わせて利用する場合に利用するWrapperComponentです。
 * 通常のControl + Autocomplete を定義するよりも簡易に記述することが可能です。
 *
 * ※オプションのラベルを変更したい場合は、optionLabelを設定してください。
 * 　デフォルトのラベル：オプションのname
 * ※オプションをどの値で検索するかを指定したい場合は、onSearchFieldを設定してください。
 *
 * 使用例：オプションのラベルを「名前(カナ)」に設定する場合（queryResultはuseFormより取得）
 * <pre>
 * const postsData = queryResult?.data ? queryResult.data.data : undefined
 * <ControlAutocomplete
 *   resource='companies'
 *   label='会社名'
 *   name='companyId'
 *   defaultId={postsData?.companyId}
 *   control={control}
 *   error={!!errors.companyId}
 *   helperText={errors.companyId?.message}
 *   onSearchField='name'
 *   optionLabel={(option: any) => {
 *     return option?.name + '(' + option?.nameKana + ')' ?? ''
 *   }}
 * />
 * </pre>
 */

export const ControlAutocomplete = (props: Props) => {
  const { resource, label, name, control, error, helperText, defaultId, onSearchField, optionLabel } = props

  const { autocompleteProps } = useAutocomplete({
    resource: resource,
    ...(defaultId ? { defaultValue: defaultId } : {}),
    onSearch: (value) => [
      {
        field: onSearchField ?? 'name',
        operator: 'eq',
        value,
      },
    ],
  })

  return (
    <Controller
      control={control}
      name={name}
      defaultValue={null as any}
      render={({ field }) => (
        <Autocomplete
          {...autocompleteProps}
          {...field}
          onChange={(_, value) => {
            field.onChange(value?.id)
          }}
          getOptionLabel={(item) => {
            const option = autocompleteProps?.options?.find((p) => p?.id?.toString() === (item.id ?? item)?.toString())
            return optionLabel ? (option ? optionLabel(option) : '') : option?.name ?? ''
          }}
          isOptionEqualToValue={(option, value) => {
            return value === '' || option?.id?.toString() === value?.toString()
          }}
          renderOption={(props: React.HTMLAttributes<HTMLLIElement>, option: any) => {
            return (
              <li {...props} key={option.id}>
                {option ? (optionLabel ? optionLabel(option) : option.name) : 'none..' + (option || '|')}
              </li>
            )
          }}
          renderInput={(params) => <TextField {...params} label={label} error={error} helperText={helperText} />}
        />
      )}
    />
  )
}
