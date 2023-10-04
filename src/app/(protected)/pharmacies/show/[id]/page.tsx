'use client'

import { Stack, Button } from '@mui/material'
import { useShow } from '@refinedev/core'
import { CloneButton, Show } from '@refinedev/mui'
import React from 'react'
import { notFound } from 'next/navigation'
import { HTTP_STATUS } from '@/core/configs/constants'
import { setTitle } from '@/core/utils/refineUtil'
import { PharmacyModel } from '@/types'
import { FieldItem } from '@components/core/content/FieldItem'
import { formatDateTime } from '@/core/utils/dateUtil'
import SearchIcon from '@mui/icons-material/Search'

const ShowPage: React.FC = () => {
  setTitle()
  const { queryResult } = useShow<PharmacyModel>({ errorNotification: false })
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
      // footerButtonProps={{
      //   sx: {
      //     display: 'flex',
      //     justifyContent: 'flex-end',
      //   },
      // }}
      footerButtons={() => (
        <>
          <Button
            // variant='contained'
            //TODO: 施設API作成後にリンク先をテストする予定
            href={`../../health_facilities?filters[0][field]=pharmacy.id&filters[0][operator]=eq&filters[0][value]=${record?.id}`}
            startIcon={<SearchIcon />}
          >
            関連施設を表示
          </Button>
        </>
      )}
    >
      <Stack gap={1}>
        <FieldItem label='ID' value={record?.id} />
        <FieldItem label='会社名' value={record?.company?.name} />
        <FieldItem label='薬局名' value={record?.pharmacyGroup?.name} />
        <FieldItem label='店舗名' value={record?.name} />
        <FieldItem label='店舗カナ名称' value={record?.nameKana} />
        <FieldItem label='薬局 店舗' value={(record?.pharmacyGroup?.name + ' ' ?? '') + record?.name} />
        <FieldItem label='カナ名称' value={(record?.pharmacyGroup?.nameKana + ' ' ?? '') + record?.nameKana} />
        <FieldItem label='医療機関コード' value={record?.medicalInstitutionCode} />
        <FieldItem label='郵便番号' value={record?.postalCode} />
        <FieldItem label='住所' value={(record?.address1 || '') + '\n' + (record?.address2 || '')} multiline />
        <FieldItem label='電話番号' value={record?.tel} />
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
