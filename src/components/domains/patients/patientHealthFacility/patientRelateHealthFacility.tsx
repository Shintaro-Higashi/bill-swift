'use client'

/**
 * 患者関連施設履歴Listを表示および操作します。
 * <pre>
 *  ・運用上レコード数が10を超えることもないためページネーション表示はしません。
 *  ・レコードに対しての編集及び削除機能も提供します。
 * </pre>
 */
import React, { Fragment, useState } from 'react'
import { PatientModel, PatientRelateHealthFacilityModel } from '@/types'
import { Alert, Box, IconButton } from '@mui/material'
import { HttpError, useCustom } from '@refinedev/core'
import { formatDate } from '@/core/utils/dateUtil'
import { HistoryOutlined } from '@mui/icons-material'
import { PaperBox } from '@components/core/content/paperBox'
import { DataGrid, GridColDef, GridRowClassNameParams } from '@mui/x-data-grid'

import { RubyItem } from '@components/core/content/rubyItem'
import { getPatientHealthFacilityChangeReasonValue } from '@/shared/items/patientHealthFacilityChangeReason'
import EditOutlined from '@mui/icons-material/EditOutlined'
import { isPast } from 'date-fns'
import { isFutureChangedPatientHealthFacility } from '@/shared/services/patientRelateHealthFacilityService'
import { ChangePatientHealthFacilityDialogForm } from '@components/domains/patients/patientHealthFacility/changePatientHealthFacilityDialogForm'
import { DeleteButton } from '@refinedev/mui'
import { getRefineRefreshButton } from '@/core/utils/refineUtil'

type Props = {
  patient: PatientModel
  onFinish?: () => void
}

export const PatientRelateHealthFacility = (props: Props) => {
  const { patient } = props

  const resourceUrl = `patients/${patient.id}/health-facilities`

  const { data, isLoading, isError } = useCustom<PatientRelateHealthFacilityModel[], HttpError>({
    method: 'get',
    url: `/api/${resourceUrl}`,
    config: {
      query: { uid: patient.updatedAt },
    },
  })

  const [editPatientRelateHealthFacility, setEditPatientRelateHealthFacility] = useState<
    PatientRelateHealthFacilityModel | undefined
  >(undefined)

  const [open, setOpen] = useState(false)
  const handleOpen = (editModel: PatientRelateHealthFacilityModel) => {
    setEditPatientRelateHealthFacility(editModel)
    setOpen(true)
  }
  const onClose = (_isSuccess: boolean) => {
    setOpen(false)
  }

  const columns = React.useMemo<GridColDef<PatientRelateHealthFacilityModel>[]>(
    () => [
      {
        field: 'actions',
        headerName: '操作',
        sortable: false,
        filterable: false,
        hideable: false,
        flex: 1,
        minWidth: 100,
        renderCell: function render({ row }) {
          const isFutureHF = isFutureChangedPatientHealthFacility(row)
          return (
            <Box sx={{ alignItems: 'flex-start' }}>
              <IconButton aria-label='edit' color='primary' onClick={() => handleOpen(row)}>
                <EditOutlined fontSize='small' />
              </IconButton>
              {isFutureHF && (
                <Box component='div' sx={{ display: 'inline-block' }}>
                  <DeleteButton
                    hideText
                    recordItemId={row.id}
                    resource={`/${resourceUrl}`}
                    successNotification={() => {
                      getRefineRefreshButton()?.click()
                      return {
                        message: '関連施設情報の予約を取り消しました',
                        description: '取消完了',
                        type: 'success',
                      }
                    }}
                    errorNotification={() => {
                      return {
                        message: '関連施設情報の予約取消ができませんでした',
                        description: '取消失敗',
                        type: 'error',
                      }
                    }}
                  />
                </Box>
              )}
            </Box>
          )
        },
      },
      {
        field: 'pharmacy',
        headerName: '店舗',
        sortable: false,
        minWidth: 200,
        maxWidth: 300,
        flex: 1,
        renderCell: ({ row }) => {
          return (
            <Box>
              {row.healthFacility?.pharmacy?.pharmacyGroup?.name + ' ' ?? ''}
              <RubyItem value={row.healthFacility?.pharmacy?.name} ruby={row.healthFacility?.pharmacy?.nameKana} />
            </Box>
          )
        },
      },
      {
        field: 'healthFacility',
        headerName: '施設',
        sortable: false,
        minWidth: 200,
        maxWidth: 300,
        flex: 1,
        renderCell: ({ row }) => {
          return <RubyItem value={row.healthFacility.name} ruby={row.healthFacility.nameKana} />
        },
      },
      { field: 'patientCode', headerName: 'コード', sortable: false, width: 80 },
      {
        field: 'reason',
        headerName: '退出理由',
        sortable: false,
        renderCell: ({ row }) => {
          return <>{getPatientHealthFacilityChangeReasonValue(row?.reason)}</>
        },
      },
      {
        field: 'startDate',
        headerName: '入居(予定)日',
        sortable: false,
        width: 105,
        renderCell: ({ row }) => {
          return <>{formatDate(row?.startDate)}</>
        },
      },
      {
        field: 'endDate',
        headerName: '退出(予定)日',
        sortable: false,
        width: 105,
        renderCell: ({ row }) => {
          return <>{formatDate(row.endDate)}</>
        },
      },
      {
        field: 'note',
        headerName: '備考',
        sortable: false,
        flex: 1,
        minWidth: 100,
        maxWidth: 400,
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  const records = data?.data

  /**
   * 施設情報に過去が発生しているかか否かを判断します。
   */
  const isChangedPatientHealthFacility = () => {
    if (!records) return false
    if (records.length > 1) return true
    // 1件でも退出時は表示
    const nowHealthFacility = records[0]
    return nowHealthFacility.reason
  }

  /**
   * 現在利用中の施設や変更予定の施設をハイライトします
   * @param params
   */
  const addRowClassName = (params: GridRowClassNameParams<PatientRelateHealthFacilityModel>) => {
    if (params.row.healthFacilityId === patient.healthFacilityId && params.row.patientCode === patient.code) {
      return 'rows-now-health-facility'
    } else if (!isPast(params.row.startDate)) {
      return 'rows-future-health-facility'
    }
    return ''
  }

  return (
    <PaperBox title='施設変更履歴' icon={<HistoryOutlined />} sx={{ p: 0, mt: 1 }}>
      {!isChangedPatientHealthFacility() ? (
        <Box sx={{ pl: 2 }}>変更はありません</Box>
      ) : (
        <div style={{ width: '100%', padding: '8px' }}>
          {isFutureChangedPatientHealthFacility(records) && (
            <Box sx={{ p: 1, pt: 0 }}>
              <Alert severity='info'>所得施設情報の変更予約があります</Alert>
            </Box>
          )}
          <div style={{ maxHeight: 200, width: '100%', overflowY: 'auto' }}>
            <ChangePatientHealthFacilityDialogForm
              open={open}
              onClose={onClose}
              patient={patient}
              patientRelateHealthFacility={editPatientRelateHealthFacility}
            />
            <DataGrid
              columnHeaderHeight={40}
              autoHeight
              rows={records ?? []}
              columns={columns}
              hideFooter
              disableColumnFilter
              disableColumnSelector
              disableVirtualization
              disableDensitySelector
              // TODO https://mui.com/x/react-data-grid/style/#styling-rows darkも意識して対応したい
              sx={{
                '& .rows-now-health-facility': {
                  background: 'rgba(104, 159, 56, 0.08) !important',
                },
                '& .rows-future-health-facility': {
                  background: 'rgb(255, 244, 229) !important',
                },
              }}
              getRowClassName={addRowClassName}
            />
          </div>
        </div>
      )}
    </PaperBox>
  )
}
