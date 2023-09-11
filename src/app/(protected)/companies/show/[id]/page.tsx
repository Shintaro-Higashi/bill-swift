'use client'

import { Stack } from '@mui/material'
import { useShow } from '@refinedev/core'
import { CloneButton, Show } from '@refinedev/mui'
import React from 'react'

import { notFound } from 'next/navigation'
import { HTTP_STATUS } from '@/core/configs/constants'
import { setTitle } from '@/core/utils/refineUtil'
import { CompanyModel } from '@/types'
import { FieldItem } from '@components/core/content/FieldItem'
import { formatDateTime } from '@/core/utils/dateUtil'

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
      isLoading={isLoading && !record}
      headerButtons={({ defaultButtons }) => (
        <>
          {defaultButtons}
          <CloneButton disabled={isLoading} />
        </>
      )}
    >
      <Stack gap={1}>
        <FieldItem label='ID' value={record?.id} />
        <FieldItem label='会社名' value={record?.name} />
        <FieldItem label='郵便番号' value={record?.postalCode} />
        <FieldItem label='住所' value={(record?.address1 || '') + '\n' + (record?.address2 || '')} multiline />
        <FieldItem label='電話番号' value={record?.telephone} />
        <FieldItem label='FAX番号' value={record?.fax} />
        <FieldItem label='作成日時' value={formatDateTime(record?.createdAt)} />
        <FieldItem label='作成者' value={record?.createdUser?.name} />
        <FieldItem label='更新日時' value={formatDateTime(record?.createdAt)} />
        <FieldItem label='更新者' value={record?.updatedUser?.name} />
      </Stack>
    </Show>
  )
}

export default ShowPage
