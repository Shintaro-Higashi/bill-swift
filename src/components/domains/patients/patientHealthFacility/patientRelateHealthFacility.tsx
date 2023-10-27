'use client'

import React, { useEffect, useState } from 'react'
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
  // 変更履歴リスト取得完了時のcallback
  onLoaded?: (records: PatientRelateHealthFacilityModel[]) => void
}

/**
 * 患者関連施設履歴Listを表示および操作を提供します
 * <pre>
 *  ・運用上レコード数が10を超えることもないためページネーション表示はしません。
 *  ・レコードに対しての編集及び削除機能も提供します。
 * </pre>
 */
export const PatientRelateHealthFacility = (props: Props) => {
  const { patient, onLoaded } = props

  const resourceUrl = `patients/${patient.id}/health-facilities`

  const { data, isLoading, isSuccess } = useCustom<PatientRelateHealthFacilityModel[], HttpError>({
    method: 'get',
    url: `/api/${resourceUrl}`,
    config: {
      query: { uid: patient.updatedAt },
    },
  })

  useEffect(() => {
    if (data?.data && onLoaded) {
      onLoaded(data?.data)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.data])

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

  const commonColumnsProperties = {
    sortable: false,
    filterable: false,
    hideable: false,
    flex: 1,
  }

  const columns = React.useMemo<GridColDef<PatientRelateHealthFacilityModel>[]>(
    () => [
      {
        field: 'actions',
        headerName: '操作',
        minWidth: 95,
        maxWidth: 95,
        ...commonColumnsProperties,
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
                    accessControl={{ enabled: false }}
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
        minWidth: 200,
        maxWidth: 300,
        ...commonColumnsProperties,
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
        minWidth: 200,
        maxWidth: 300,
        ...commonColumnsProperties,
        renderCell: ({ row }) => {
          return <RubyItem value={row?.healthFacility?.name} ruby={row?.healthFacility?.nameKana} />
        },
      },
      { field: 'patientCode', headerName: '患者番号', minWidth: 90, maxWidth: 90, ...commonColumnsProperties },
      {
        field: 'reason',
        headerName: '退出理由',
        minWidth: 90,
        maxWidth: 90,
        ...commonColumnsProperties,
        renderCell: ({ row }) => {
          return <>{getPatientHealthFacilityChangeReasonValue(row?.reason)}</>
        },
      },
      {
        field: 'startDate',
        headerName: '入居(予定)日',
        minWidth: 105,
        maxWidth: 105,
        ...commonColumnsProperties,
        renderCell: ({ row }) => {
          return <>{formatDate(row?.startDate)}</>
        },
      },
      {
        field: 'endDate',
        headerName: '退出(予定)日',
        minWidth: 105,
        maxWidth: 105,
        ...commonColumnsProperties,
        renderCell: ({ row }) => {
          return <>{formatDate(row.endDate)}</>
        },
      },
      {
        field: 'note',
        headerName: '備考',
        minWidth: 100,
        maxWidth: 400,
        ...commonColumnsProperties,
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
            <Box sx={{ pb: 1 }}>
              <Alert severity='info'>所属施設の変更予約があります</Alert>
            </Box>
          )}
          <div style={{ maxHeight: 300, width: '100%', overflowY: 'auto' }}>
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
              // TODO theme color を追加したほうがよさそう
              sx={{
                '& .rows-now-health-facility': {
                  background: (theme) => theme.palette.info.light,
                  '&:hover': { background: (theme) => theme.palette.info.light },
                },
                '& .rows-future-health-facility': {
                  background: (theme) => theme.palette.warning.light,
                  '&:hover': { background: (theme) => theme.palette.warning.light },
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
