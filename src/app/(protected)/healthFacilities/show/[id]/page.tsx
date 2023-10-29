'use client'

import { Box, Stack, Button, IconButton } from '@mui/material'
import { useShow } from '@refinedev/core'
import { Show } from '@refinedev/mui'
import React from 'react'
import { handleApiError, setTitle } from '@/core/utils/refineUtil'
import { HealthFacilityModel } from '@/types'
import { FieldItem } from '@components/core/content/FieldItem'
import { formatDateTime, formatDate, isPastDate } from '@/core/utils/dateUtil'
import { getPatientSortTypeValue } from '@/shared/items/patientSortType'
import { BasicTable } from '@/components/core/content/basicTable'
import HistoryIcon from '@mui/icons-material/History'
import { getBillingTypeValue } from '@/shared/items/billingType'
import { getHealthFacilityPaymentTypeValue } from '@/shared/items/healthFacilityPaymentType'
import { joinString } from '@/core/utils/commonUtil'
import { RubyItem } from '@components/core/content/rubyItem'
import { BasicDialog } from '@/components/core/content/basicDialog'
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined'
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined'
import { HealthFacilityRelatePharmacySaveForm } from '@/components/domains/healthFacilityRelatePharmacies/healthFacilityRelatePharmacySaveForm'
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined'
import useConfirm from '@/core/hooks/useConfirm'
import Alert from '@mui/material/Alert'

/**
 * createOpenDialogButtonプロップス型定義
 */
type CreateOpenDialogButtonProps = {
  // ダイアログを開くためのボタンをレンダリングする関数
  renderOpenDialogButton: (handleOpenDialog: () => void) => React.ReactElement
  // 保存ボタンを押下した際の処理
  submit: (e: any) => void
  // ダイアログのキー
  key?: string
  // 施設関連薬局ID
  healthFacilityRelatePharmacyId?: string
  // 過去の対応開始日かどうか
  isPastStartDate?: boolean
}

/**
 * ダイアログを表示するボタンを生成します。
 */
const createOpenDialogButton = ({
  renderOpenDialogButton,
  submit,
  key,
  healthFacilityRelatePharmacyId,
  isPastStartDate,
}: CreateOpenDialogButtonProps) => (
  <BasicDialog
    key={key}
    title='担当店舗の変更'
    content={
      <HealthFacilityRelatePharmacySaveForm
        healthFacilityRelatePharmacyId={healthFacilityRelatePharmacyId}
        isPastStartDate={isPastStartDate}
      />
    }
    renderOpenDialogButton={renderOpenDialogButton}
    renderSaveButton={(handleCloseDialog) => (
      <Button
        variant='contained'
        startIcon={<SaveOutlinedIcon />}
        onClick={(e) => {
          handleCloseDialog()
          submit(e)
        }}
      >
        保存
      </Button>
    )}
  />
)

/**
 * 施設詳細画面です。
 */
const ShowPage: React.FC = () => {
  setTitle()
  const { queryResult } = useShow<HealthFacilityModel>({ errorNotification: false })
  const { data, isLoading, error } = queryResult
  const record = data?.data
  const startDate = record?.healthFacilityRelatePharmacy
    ? new Date(record?.healthFacilityRelatePharmacy[0].startDate)
    : null
  handleApiError(error)

  const { $confirm } = useConfirm()
  const handleCreate = (e: React.BaseSyntheticEvent | any) => {
    $confirm({
      message: '店舗変更予定を新規作成します。操作を続けてもよろしいですか',
      onConfirm() {
        // TODO: 作成処理（Refine: useCreateを想定）
      },
    })
  }
  const handleEdit = (e: React.BaseSyntheticEvent | any) => {
    $confirm({
      message: '店舗変更予定を編集します。操作を続けてもよろしいですか',
      onConfirm() {
        // TODO: 編集処理（Refine: useUpdateを想定）
      },
    })
  }
  const handleDelete = (e: React.BaseSyntheticEvent | any) => {
    $confirm({
      message: '店舗変更予定を削除します。操作を続けてもよろしいですか',
      onConfirm() {
        // TODO: 削除処理（Refine: useDeleteを想定）
      },
    })
  }

  // 変更予定アラートを表示するための変数
  let isChangingAssignedPharmacy: boolean = false

  // 店舗変更履歴テーブルヘッダー、幅定義
  const tableHeadRow = [
    '操作',
    '店舗名',
    '開始日',
    '終了日',
    '請求種別',
    '支払い種別',
    '振込口座',
    '患者ソート種別',
    '備考',
  ]
  const columnWidth = [90, 240, 100, 100, 80, 95, 170, 130, 450]

  // 店舗変更履歴テーブルボディー定義
  let tableBodyRows: any[] = []
  let highLightRows: number[] = []
  if (record?.healthFacilityRelatePharmacy) {
    const relatePharmacies = Object.entries(record?.healthFacilityRelatePharmacy)

    // 施設関連薬局のレコードをループし、テーブルボディー配列に格納
    relatePharmacies.forEach(([key, value]: [string, any]) => {
      const isPastStartDate = isPastDate(new Date(value.startDate))
      const tableBodyRow = [
        <Box key={key} display='flex'>
          {createOpenDialogButton({
            renderOpenDialogButton: (handleOpenDialog) => (
              <IconButton onClick={handleOpenDialog}>
                <ModeEditOutlineOutlinedIcon color='primary' fontSize='small' />
              </IconButton>
            ),
            submit: handleEdit,
            key: key,
            healthFacilityRelatePharmacyId: value.id,
            isPastStartDate: isPastStartDate,
          })}
          {!isPastStartDate && (
            <IconButton onClick={handleDelete}>
              <DeleteOutlineOutlinedIcon sx={{ color: '#d32f2f' }} fontSize='small' />
            </IconButton>
          )}
        </Box>,
        value.pharmacy.pharmacyGroup.name + ' ' + value.pharmacy.name,
        formatDate(value.startDate),
        formatDate(value.endDate),
        getBillingTypeValue(value.billingType),
        getHealthFacilityPaymentTypeValue(value.paymentType),
        value.accountManage?.name,
        getPatientSortTypeValue(value.patientSortType),
        value.note,
      ]
      tableBodyRows = [...tableBodyRows, tableBodyRow]

      // ハイライト行を設定
      if (value.pharmacy.id === record?.pharmacy?.id) {
        highLightRows = [...highLightRows, Number(key) + 1]
      }
      // 変更予定アラート表示設定
      if (!isPastStartDate) {
        isChangingAssignedPharmacy = true
      }
    })
  }

  return (
    <Show isLoading={isLoading && !record}>
      <Stack gap={1} sx={{ mb: 2 }}>
        {isChangingAssignedPharmacy && <Alert severity='error'>担当店舗変更の予定があります。</Alert>}
        <FieldItem label='対応開始日' value={formatDate(startDate)} />
        <FieldItem
          label='担当店舗'
          value={
            <>
              <Box>
                {record ? (
                  <>
                    {record?.pharmacy?.pharmacyGroup?.name + ' ' ?? ''}
                    <RubyItem value={record?.pharmacy?.name} ruby={record?.pharmacy?.nameKana} />
                  </>
                ) : (
                  ' '
                )}
              </Box>
              {createOpenDialogButton({
                renderOpenDialogButton: (handleOpenDialog) => (
                  <Button variant='contained' startIcon={<ModeEditOutlineOutlinedIcon />} onClick={handleOpenDialog}>
                    変更
                  </Button>
                ),
                submit: handleCreate,
              })}
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
        padding='6px'
      />
    </Show>
  )
}

export default ShowPage
