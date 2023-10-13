'use client'

import { Stack, Button } from '@mui/material'
import { useLink, useShow } from '@refinedev/core'
import { CloneButton, Show } from '@refinedev/mui'
import React from 'react'
import { notFound } from 'next/navigation'
import { HTTP_STATUS } from '@/core/configs/constants'
import { setTitle } from '@/core/utils/refineUtil'
import { PharmacyModel } from '@/types'
import { FieldItem } from '@components/core/content/FieldItem'
import { formatDateTime } from '@/core/utils/dateUtil'
import SearchIcon from '@mui/icons-material/Search'
import { PAGINATE_CONFIG } from '@/core/configs/constants'

const ShowPage: React.FC = () => {
  setTitle()
  const Link = useLink()
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
      footerButtonProps={{
        sx: {
          display: 'flex',
          justifyContent: 'flex-end',
        },
      }}
      footerButtons={() => (
        <Stack direction='row' justifyContent='flex-end' sx={{ width: 1, margin: 0, padding: 0 }}>
          <Button
            href={`../../healthFacilities?pageSize=${PAGINATE_CONFIG.DEFAULT_PAGE_SIZE}&current=1&filters[0][field]=pharmacyId&filters[0][operator]=eq&filters[0][value]=${record?.id}&filters[1][field]=_uid&filters[1][operator]=eq&filters[1][value]=1`}
            startIcon={<SearchIcon />}
          >
            関連施設を表示
          </Button>
        </Stack>
      )}
    >
      <Stack gap={1}>
        <FieldItem label='会社名' value={record?.company?.name} />
        <FieldItem label='薬局名' value={record?.pharmacyGroup?.name} />
        <FieldItem label='店舗名' value={record?.name} />
        <FieldItem label='店舗カナ名称' value={record?.nameKana} />
        <FieldItem label='薬局 店舗' value={(record?.pharmacyGroup?.name + ' ' ?? '') + record?.name} />
        <FieldItem label='カナ名称' value={(record?.pharmacyGroup?.nameKana + ' ' ?? '') + record?.nameKana} />
        <FieldItem
          label='振替口座'
          value={record?.withdrawalAccountManage?.name}
          helperText='個人の患者様向けの請求口座情報を設定します'
        />
        <FieldItem
          label='振込口座'
          value={record?.transferAccountManage?.name}
          helperText='施設向けの請求口座情報を設定します'
        />
        <FieldItem label='医療機関コード' value={record?.medicalInstitutionCode} />
        <FieldItem label='郵便番号' value={record?.postalCode} />
        <FieldItem
          label='住所'
          value={(record?.address1 || '') + (record?.address2 ? '\n' + (record?.address2 || '') : '')}
          multiline
        />
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
