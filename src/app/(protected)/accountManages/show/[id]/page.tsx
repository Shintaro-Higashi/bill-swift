'use client'

import { Stack } from '@mui/material'
import { useShow } from '@refinedev/core'
import { Show } from '@refinedev/mui'
import React from 'react'

import { handleApiError, setTitle } from '@/core/utils/refineUtil'
import { AccountManageModel } from '@/types'
import { FieldItem } from '@components/core/content/FieldItem'
import { formatDateTime } from '@/core/utils/dateUtil'
import { getAccountTypeValue } from '@/shared/items/accountType'

const ShowPage: React.FC = () => {
  setTitle()
  const { queryResult } = useShow<AccountManageModel>({ errorNotification: false })
  const { data, isLoading, error } = queryResult
  const record = data?.data
  handleApiError(error)
  return (
    <Show isLoading={isLoading && !record}>
      <Stack gap={1}>
        <FieldItem label='名称' value={record?.name} />
        <FieldItem label='振替日' value={record?.transferDate} />
        <FieldItem label='金融機関コード' value={record?.financialCode} />
        <FieldItem label='金融機関名' value={record?.financialName} />
        <FieldItem label='支店コード' value={record?.branchCode} />
        <FieldItem label='支店名称' value={record?.branchName} />
        <FieldItem label='口座種別' value={getAccountTypeValue(record?.accountType)} />
        <FieldItem label='口座番号' value={record?.accountNo} />
        <FieldItem label='口座名義' value={record?.accountName} />
        <FieldItem label='作成日時' value={formatDateTime(record?.createdAt)} />
        <FieldItem label='作成者' value={record?.createdUser?.name} />
        <FieldItem label='更新日時' value={formatDateTime(record?.updatedAt)} />
        <FieldItem label='更新者' value={record?.updatedUser?.name} />
      </Stack>
    </Show>
  )
}

export default ShowPage
