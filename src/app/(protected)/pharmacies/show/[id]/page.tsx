'use client'

import { Button, Stack } from '@mui/material'
import { useLink, useShow } from '@refinedev/core'
import { Show } from '@refinedev/mui'
import React from 'react'
import { handleApiError, setTitle } from '@/core/utils/refineUtil'
import { PharmacyModel } from '@/types'
import { FieldItem } from '@components/core/content/FieldItem'
import { formatDateTime } from '@/core/utils/dateUtil'
import SearchIcon from '@mui/icons-material/Search'
import { RubyItem } from '@components/core/content/rubyItem'
import { joinString } from '@/core/utils/commonUtil'

const ShowPage: React.FC = () => {
  setTitle()
  const Link = useLink()
  const { queryResult } = useShow<PharmacyModel>({ errorNotification: false })
  const { data, isLoading, error } = queryResult
  const record = data?.data
  handleApiError(error)

  return (
    <Show
      isLoading={isLoading && !record}
      footerButtons={() => (
        <Stack direction='row' justifyContent='flex-end' sx={{ width: 1, margin: 0, padding: 0 }}>
          <Button
            component={Link}
            to={`/healthFacilities?filters[0][field]=pharmacyId&filters[0][operator]=eq&filters[0][value]=${record?.id}`}
            startIcon={<SearchIcon />}
          >
            関連施設を表示
          </Button>
        </Stack>
      )}
    >
      <Stack gap={1}>
        <FieldItem label='会社名' value={<RubyItem value={record?.company?.name} ruby={record?.company?.nameKana} />} />
        <FieldItem label='薬局名' value={record?.pharmacyGroup?.name} />
        <FieldItem label='店舗名' value={<RubyItem value={record?.name} ruby={record?.nameKana} />} />
        <FieldItem
          label='振替口座'
          value={record?.withdrawalAccountManage?.name}
          helperText='個人の患者様向けの請求口座情報'
        />
        <FieldItem label='振込口座' value={record?.transferAccountManage?.name} helperText='施設向けの請求口座情報' />
        <FieldItem label='医療機関コード' value={record?.medicalInstitutionCode} />
        <FieldItem label='住所' value={joinString([record?.postalCode, record?.address1, record?.address2])} />
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
