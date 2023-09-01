'use client'

import { Typography, Stack } from '@mui/material'
import { useOne, useShow } from '@refinedev/core'
import { Show, NumberField, TextFieldComponent as TextField, MarkdownField, DateField } from '@refinedev/mui'
import React from 'react'
import { ICategory } from 'src/types'
import Head from 'next/head'

const PostShow: React.FC = () => {
  const { queryResult } = useShow()
  const { data, isLoading } = queryResult
  const record = data?.data

  const { data: categoryData, isLoading: categoryIsLoading } = useOne<ICategory>({
    dataProviderName: 'fake',
    resource: 'categories',
    id: record?.category.id || '',
    queryOptions: {
      enabled: !!record?.category.id,
    },
  })

  return (
    <Show isLoading={isLoading}>
      <Head>
        <title>記事詳細</title>
      </Head>
      <Stack gap={1}>
        <Typography variant='body1' fontWeight='bold'>
          ID
        </Typography>
        <NumberField value={record?.id ?? ''} />
        <Typography variant='body1' fontWeight='bold'>
          タイトル
        </Typography>
        <TextField value={record?.title} />
        <Typography variant='body1' fontWeight='bold'>
          内容
        </Typography>
        <MarkdownField value={record?.content} />
        <Typography variant='body1' fontWeight='bold'>
          カテゴリ
        </Typography>

        {categoryIsLoading ? <>Loading...</> : <>{categoryData?.data?.title}</>}
        <Typography variant='body1' fontWeight='bold'>
          ステータス
        </Typography>
        <TextField value={record?.status} />
        <Typography variant='body1' fontWeight='bold'>
          作成日時
        </Typography>
        <DateField value={record?.createdAt} />
      </Stack>
    </Show>
  )
}

export default PostShow
