'use client'

import { Stack } from '@mui/material'
import { useShow } from '@refinedev/core'
import { CloneButton, Show } from '@refinedev/mui'
import React from 'react'
import { notFound } from 'next/navigation'
import { HTTP_STATUS } from '@/core/configs/constants'
import { setTitle } from '@/core/utils/refineUtil'
import { HealthFacilityModel } from '@/types'
import { FieldItem } from '@components/core/content/FieldItem'
import { formatDateTime } from '@/core/utils/dateUtil'
import { getPatientSortTypeValue } from '@/shared/items/patientSortType'
import { BasicTable } from '@/components/core/content/basicTable'
import HistoryIcon from '@mui/icons-material/History'
import { getBillingTypeValue } from '@/shared/items/billingType'
import { getHealthFacilityPaymentTypeValue } from '@/shared/items/healthFacilityPaymentType'
import { getTransferGuideValue } from '@/shared/items/transferGuide'

const ShowPage: React.FC = () => {
  setTitle()
  const { queryResult } = useShow<HealthFacilityModel>({ errorNotification: false })
  const { data, isLoading, error } = queryResult
  const record = data?.data
  if ((error as any)?.statusCode === HTTP_STATUS.NOT_FOUND) {
    notFound()
  }

  /** 店舗変更履歴データを取得 */
  let tableBodyRows: any[] = []
  let highLightRows: number[] = []
  const tableHeadRow = ['店舗名', '開始日', '終了日', '備考']
  const columnWidth = ['40%', '15%', '15%', '30%']

  if (record?.healthFacilityRelatePharmacy) {
    const relatePharmacies = Object.entries(record?.healthFacilityRelatePharmacy)
    relatePharmacies.forEach(([key, value]: [string, any]) => {
      if (value?.pharmacy) {
        let startDate = formatDateTime(value.startDate, { fmt: 'yyyy/MM/dd' })
        let endDate = formatDateTime(value.endDate, { fmt: 'yyyy/MM/dd' })

        const tableBodyRow = [
          value.pharmacy.pharmacyGroup.name + ' ' + value.pharmacy.name,
          startDate,
          endDate,
          value.note,
        ]
        tableBodyRows = [...tableBodyRows, tableBodyRow]
        if (value.pharmacy.id === record?.pharmacy?.id) {
          highLightRows = [...highLightRows, Number(key) + 1]
        }
      }
    })
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
      <Stack gap={1} sx={{ mb: 2 }}>
        <FieldItem
          label='担当店舗'
          value={record?.pharmacy ? record?.pharmacy?.pharmacyGroup?.name + ' ' + record?.pharmacy?.name : ''}
        />
        <FieldItem label='コード' value={record?.code} />
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
        <FieldItem label='メールアドレス' value={record?.mail} />
        <FieldItem label='URL' value={record?.url} />
        <FieldItem label='請求種別' value={record?.billingType ? getBillingTypeValue(record?.billingType) : ''} />
        <FieldItem
          label='支払い種別'
          value={record?.paymentType ? getHealthFacilityPaymentTypeValue(record?.paymentType) : ''}
        />
        <FieldItem label='振込案内' value={record?.transferGuide ? getTransferGuideValue(record?.transferGuide) : ''} />
        <FieldItem
          label='患者ソート種別'
          value={record?.patientSortType ? getPatientSortTypeValue(record?.patientSortType) : ''}
        />
        <FieldItem label='備考' value={record?.note} multiline />
        <FieldItem label='作成日時' value={formatDateTime(record?.createdAt)} />
        <FieldItem label='作成者' value={record?.createdUser?.name} />
        <FieldItem label='更新日時' value={formatDateTime(record?.createdAt)} />
        <FieldItem label='更新者' value={record?.updatedUser?.name} />
      </Stack>
      <BasicTable
        title='店舗変更履歴'
        tableHeadRow={tableHeadRow}
        tableBodyRows={tableBodyRows}
        columnWidth={columnWidth}
        icon={<HistoryIcon />}
        highLightRows={highLightRows}
      />
    </Show>
  )
}

export default ShowPage
