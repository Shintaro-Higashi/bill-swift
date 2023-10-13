'use client'

import { Button, Stack } from '@mui/material'
import { useLink, useShow } from '@refinedev/core'
import { CloneButton, Show } from '@refinedev/mui'
import React from 'react'

import { notFound } from 'next/navigation'
import { HTTP_STATUS, PAGINATE_CONFIG } from '@/core/configs/constants'
import { setTitle } from '@/core/utils/refineUtil'
import { CompanyModel } from '@/types'
import { FieldItem } from '@components/core/content/FieldItem'
import { formatDateTime } from '@/core/utils/dateUtil'
import SearchIcon from '@mui/icons-material/Search'

const ShowPage: React.FC = () => {
  setTitle()
  const { queryResult } = useShow<CompanyModel>({ errorNotification: false })
  const { data, isLoading, error } = queryResult
  const record = data?.data
  const Link = useLink()
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
      footerButtons={() => (
        <Stack direction='row' justifyContent='flex-end' sx={{ width: 1, margin: 0, padding: 0 }}>
          <Button
            component={Link}
            to={`/pharmacies?filters[0][field]=companyId&filters[0][operator]=eq&filters[0][value]=${record?.id}`}
            startIcon={<SearchIcon />}
          >
            関連店舗を表示
          </Button>
        </Stack>
      )}
    >
      <Stack gap={1}>
        <FieldItem label='名称' value={record?.name} />
        <FieldItem label='カナ名称' value={record?.nameKana} />
        <FieldItem label='郵便番号' value={record?.postalCode} />
        <FieldItem
          label='住所'
          value={(record?.address1 || '') + (record?.address2 ? '\n' + (record?.address2 || '') : '')}
          multiline
        />
        <FieldItem label='電話番号' value={record?.tel} />
        <FieldItem label='FAX番号' value={record?.fax} />
        <FieldItem label='インボイス登録番号' value={record?.invoiceNo} />
        <FieldItem label='施設コードグループ名' value={record?.healthFacilityCodeGroup?.name} />
        <FieldItem label='作成日時' value={formatDateTime(record?.createdAt)} />
        <FieldItem label='作成者' value={record?.createdUser?.name} />
        <FieldItem label='更新日時' value={formatDateTime(record?.updatedAt)} />
        <FieldItem label='更新者' value={record?.updatedUser?.name} />
      </Stack>
    </Show>
  )
}

export default ShowPage
