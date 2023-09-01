'use client'

import { Stack, Typography } from '@mui/material'
import { useShow } from '@refinedev/core'
import { CloneButton, DateField, Show, TextFieldComponent as TextField } from '@refinedev/mui'
import React from 'react'
import { CompanyModel } from '@/types/companies'
import { notFound } from 'next/navigation'
import { DATE_FORMAT, HTTP_STATUS } from '@/core/configs/constants'
import { setTitle } from '@/core/utils/refineUtil'

const ShowPage: React.FC = () => {
  setTitle()
  const { queryResult } = useShow<CompanyModel>({ errorNotification: false })
  const { data, isLoading, error } = queryResult
  const record = data?.data

  if ((error as any)?.statusCode === HTTP_STATUS.NOT_FOUND) {
    notFound()
  }
  return (
    <Show
      isLoading={isLoading}
      headerButtons={({ defaultButtons }) => (
        <>
          {defaultButtons}
          <CloneButton disabled={isLoading} />
        </>
      )}
    >
      <Stack gap={1}>
        <Typography variant='body1' fontWeight='bold'>
          ID
        </Typography>
        <TextField value={record?.id} />
        <Typography variant='body1' fontWeight='bold'>
          会社名
        </Typography>
        <TextField value={record?.name} />
        <Typography variant='body1' fontWeight='bold'>
          郵便番号
        </Typography>
        <TextField value={record?.postalCode} />
        <Typography variant='body1' fontWeight='bold'>
          住所1
        </Typography>
        <TextField value={record?.address1} />
        <Typography variant='body1' fontWeight='bold'>
          住所2
        </Typography>
        <TextField value={record?.address2} />
        <Typography variant='body1' fontWeight='bold'>
          作成日時
        </Typography>
        <DateField value={record?.createdAt} format={DATE_FORMAT} />
        <Typography variant='body1' fontWeight='bold'>
          作成者
        </Typography>
        <TextField value={record?.userCompanyCreatedByTouser?.name} />
        <Typography variant='body1' fontWeight='bold'>
          更新日時
        </Typography>
        <DateField value={record?.updatedAt} format={DATE_FORMAT} />
        <Typography variant='body1' fontWeight='bold'>
          更新者
        </Typography>
        <TextField value={record?.userCompanyUpdatedByTouser?.name} />
      </Stack>
    </Show>
  )
}

export default ShowPage
