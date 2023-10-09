'use client'

import { Autocomplete, Box, TextField } from '@mui/material'
import { Create, useAutocomplete } from '@refinedev/mui'
import { useForm } from '@refinedev/react-hook-form'
import { Controller } from 'react-hook-form'
import React from 'react'

const BlogPostCreate: React.FC = () => {
  const {
    saveButtonProps,
    refineCore: { formLoading },
    register,
    control,
    formState: { errors },
  } = useForm()

  const { autocompleteProps: categoryAutocompleteProps } = useAutocomplete({
    dataProviderName: 'fake',
    resource: 'categories',
  })

  return (
    <Create isLoading={formLoading} saveButtonProps={saveButtonProps}>
      <Box component='form' sx={{ display: 'flex', flexDirection: 'column' }} autoComplete='off'>
        <TextField
          {...register('title', {
            required: 'This field is required',
          })}
          error={!!(errors as any)?.title}
          helperText={(errors as any)?.title?.message}
          margin='normal'
          fullWidth
          InputLabelProps={{ shrink: true }}
          type='text'
          label='ID'
          name='title'
        />
        <TextField
          {...register('content', {
            required: 'This field is required',
          })}
          error={!!(errors as any)?.content}
          helperText={(errors as any)?.content?.message}
          margin='normal'
          fullWidth
          InputLabelProps={{ shrink: true }}
          multiline
          label='内容'
          name='content'
        />
        <Controller
          control={control}
          name='category'
          rules={{ required: 'This field is required' }}
          // eslint-disable-next-line
          defaultValue={null as any}
          render={({ field }) => (
            <Autocomplete
              {...categoryAutocompleteProps}
              {...field}
              onChange={(_, value) => {
                field.onChange(value)
              }}
              getOptionLabel={(item) => {
                return (
                  categoryAutocompleteProps?.options?.find((p) => p?.id?.toString() === item?.id?.toString())?.title ??
                  ''
                )
              }}
              isOptionEqualToValue={(option, value) =>
                value === undefined || option?.id?.toString() === value?.id?.toString()
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label='カテゴリ'
                  margin='normal'
                  variant='outlined'
                  error={!!(errors as any)?.category?.id}
                  helperText={(errors as any)?.category?.id?.message}
                  required
                />
              )}
            />
          )}
        />
        <TextField
          {...register('status', {
            required: 'This field is required',
          })}
          error={!!(errors as any)?.status}
          helperText={(errors as any)?.status?.message}
          margin='normal'
          fullWidth
          InputLabelProps={{ shrink: true }}
          type='text'
          label='ステータス'
          name='status'
        />
        {/*
                    DatePicker component is not included in "@refinedev/mui" package.
                    To use a <DatePicker> component, you can follow the official documentation for Material UI.

                    Docs: https://mui.com/x/react-date-pickers/date-picker/#basic-usage
                */}
        <TextField
          {...register('createdAt', {
            required: 'This field is required',
          })}
          error={!!(errors as any)?.createdAt}
          helperText={(errors as any)?.createdAt?.message}
          margin='normal'
          fullWidth
          InputLabelProps={{ shrink: true }}
          label='作成日時'
          name='createdAt'
        />
      </Box>
    </Create>
  )
}
export default BlogPostCreate
