'use client'

/**
 * 患者情報変更履歴を表示するコンポーネント定義です。
 * <pre>
 * </pre>
 */
import React, { Fragment } from 'react'
import { PatientModel, PatientRelateHealthFacilityModel } from '@/types'
import { Box, IconButton } from '@mui/material'
import { HttpError, useCustom } from '@refinedev/core'
import { formatDate } from '@/core/utils/dateUtil'
import { DeleteOutlined, HistoryOutlined } from '@mui/icons-material'
import { PaperBox } from '@components/core/content/paperBox'
import { DataGrid, GridColDef, GridRowClassNameParams } from '@mui/x-data-grid'

import { RubyItem } from '@components/core/content/rubyItem'
import { getPatientHealthFacilityChangeReasonValue } from '@/shared/items/patientHealthFacilityChangeReason'
import EditOutlined from '@mui/icons-material/EditOutlined'
import { isPast } from 'date-fns'

type Props = {
  patient: PatientModel
  onFinish?: () => void
}

export const PatientRelateHealthFacility = (props: Props) => {
  const { patient } = props

  const { data, isLoading, isError } = useCustom<PatientRelateHealthFacilityModel[], HttpError>({
    method: 'get',
    url: `/api/patients/${patient.id}/health-facilities`,
    config: {
      query: { uid: patient.updatedAt },
    },
  })

  const columns = React.useMemo<GridColDef<PatientRelateHealthFacilityModel>[]>(
    () => [
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
        // renderCell: RenderCellExpand,
      },
      {
        field: 'actions',
        headerName: '操作',
        sortable: false,
        filterable: false,
        hideable: false,
        flex: 1,
        minWidth: 100,
        renderCell: function render({ row }) {
          const isFutureHF =
            !isPast(row.startDate) ||
            // 退出予定日設定は削除可
            (row.patientCode === patient.code &&
              row.healthFacilityId === patient.healthFacilityId &&
              !isPast(row.endDate))
          return (
            <Box sx={{ alignItems: 'flex-start' }}>
              <IconButton aria-label='edit' color='primary' onClick={() => handleEdit(row)}>
                <EditOutlined fontSize='small' />
              </IconButton>
              {isFutureHF && (
                <IconButton color='error' onClick={() => handleDelete(row)}>
                  <DeleteOutlined fontSize='small' />
                </IconButton>
              )}
            </Box>
          )
        },
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  const handleEdit = (row: PatientRelateHealthFacilityModel) => {}

  const handleDelete = (row: PatientRelateHealthFacilityModel) => {}

  const records = data?.data

  /**
   * 施設情報に変更が発生したか否かを判断します。
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
          <div style={{ maxHeight: 200, width: '100%', overflowY: 'auto' }}>
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
