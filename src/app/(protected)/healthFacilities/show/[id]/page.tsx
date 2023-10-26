'use client'

import { Box, Stack, Button } from '@mui/material'
import { useShow } from '@refinedev/core'
import { Show } from '@refinedev/mui'
import React from 'react'
import { handleApiError, setTitle } from '@/core/utils/refineUtil'
import { HealthFacilityModel } from '@/types'
import { FieldItem } from '@components/core/content/FieldItem'
import { formatDateTime, formatDate } from '@/core/utils/dateUtil'
import { getPatientSortTypeValue } from '@/shared/items/patientSortType'
import { BasicTable } from '@/components/core/content/basicTable'
import HistoryIcon from '@mui/icons-material/History'
import { getBillingTypeValue } from '@/shared/items/billingType'
import { getHealthFacilityPaymentTypeValue } from '@/shared/items/healthFacilityPaymentType'
import { joinString } from '@/core/utils/commonUtil'
import { RubyItem } from '@components/core/content/rubyItem'
import { BasicDialog } from '@/components/core/content/basicDialog'
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined'
import { AssignedPharmacySaveForm } from '@/components/domains/healthFacilities/assignedPharmacySaveForm'
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined'

const ShowPage: React.FC = () => {
  setTitle()
  const { queryResult } = useShow<HealthFacilityModel>({ errorNotification: false })
  const { data, isLoading, error } = queryResult
  const record = data?.data
  const startDate = record?.healthFacilityRelatePharmacy
    ? new Date(record?.healthFacilityRelatePharmacy[0].startDate)
    : null
  handleApiError(error)

  // 店舗変更履歴データを取得
  let tableBodyRows: any[] = []
  let highLightRows: number[] = []
  const tableHeadRow = ['店舗名', '開始日', '終了日', '備考']
  const columnWidth = ['40%', '15%', '15%', '30%']

  if (record?.healthFacilityRelatePharmacy) {
    const relatePharmacies = Object.entries(record?.healthFacilityRelatePharmacy)
    relatePharmacies.forEach(([key, value]: [string, any]) => {
      if (value?.pharmacy) {
        let startDate = formatDate(value.startDate)
        let endDate = formatDate(value.endDate)

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
    <Show isLoading={isLoading && !record}>
      <Stack gap={1} sx={{ mb: 2 }}>
        <FieldItem label='対応開始日' value={formatDate(startDate)} />
        <FieldItem
          label='担当店舗'
          value={
            <>
              <Box>
                {record?.pharmacy?.pharmacyGroup?.name + ' ' ?? ''}
                <RubyItem value={record?.pharmacy?.name} ruby={record?.pharmacy?.nameKana} />
              </Box>
              <BasicDialog
                title='担当店舗の変更'
                content={<AssignedPharmacySaveForm />}
                renderOpenDialogButton={(openDialog) => (
                  <Button variant='contained' startIcon={<ModeEditOutlineOutlinedIcon />} onClick={openDialog}>
                    変更
                  </Button>
                )}
                renderSaveButton={(closeDialog) => (
                  <Button
                    variant='contained'
                    startIcon={<SaveOutlinedIcon />}
                    onClick={() => {
                      // 保存処理
                      closeDialog
                    }}
                  >
                    保存
                  </Button>
                )}
              />
            </>
          }
        />
        <FieldItem label='コード' value={record?.code} />
        <FieldItem label='名称' value={<RubyItem value={record?.name} ruby={record?.nameKana} />} />
        <FieldItem label='住所' value={joinString([record?.postalCode, record?.address1, record?.address2])} />
        <FieldItem label='電話番号' value={record?.tel} />
        <FieldItem label='FAX番号' value={record?.fax} />
        <FieldItem label='メールアドレス' value={record?.mail} />
        <FieldItem label='URL' value={record?.url} />
        <FieldItem label='請求種別' value={getBillingTypeValue(record?.billingType, ' ')} />
        <FieldItem label='支払い種別' value={getHealthFacilityPaymentTypeValue(record?.paymentType, ' ')} />
        <FieldItem label='振込口座' value={record?.accountManage?.name} />
        <FieldItem label='患者ソート種別' value={getPatientSortTypeValue(record?.patientSortType, ' ')} />
        <FieldItem label='備考' value={record?.note} />
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
