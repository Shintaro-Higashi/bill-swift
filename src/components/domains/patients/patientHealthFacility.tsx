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
import { Loading } from '@components/core/content/loading'
import { formatDate, formatDateTime, toJSTDate } from '@/core/utils/dateUtil'
import { DeleteOutlined, HistoryOutlined } from '@mui/icons-material'
import { PaperBox } from '@components/core/content/paperBox'
import { DataGrid, GridColDef, GridRowClassNameParams } from '@mui/x-data-grid'

import { RubyItem } from '@components/core/content/rubyItem'
import { getPatientHealthFacilityChangeReasonValue } from '@/shared/items/patientHealthFacilityChangeReason'
import { DeleteButton, EditButton } from '@refinedev/mui'
import Button from '@mui/material/Button'
import EditOutlined from '@mui/icons-material/EditOutlined'
import { RefineButtonClassNames, RefineButtonTestIds } from '@refinedev/ui-types'
import { isPast } from 'date-fns'

type Props = {
  patient: PatientModel
  // // 変更履歴取得対象の患者ID
  // patientId: string
  // // 該当患者IDの最終更新日時(変更が発生したら履歴の再取得を行う判定に利用)
  // updatedAt: Date | null | undefined
  // 変更履歴取得完了後のcallBack(主に親に伝播したい場合に利用)
  onFinish?: () => void
}

/**
 * 患者の所属施設履歴情報を表示します。
 */
export const PatientHealthFacility = (props: Props) => {
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
        headerName: '入居日',
        sortable: false,
        width: 95,
        renderCell: ({ row }) => {
          return <>{formatDate(row?.startDate)}</>
        },
      },
      {
        field: 'endDate',
        headerName: '退出日',
        sortable: false,
        width: 95,
        renderCell: ({ row }) => {
          return <>{formatDateTime(row.endDate)}</>
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
          const isFutureHF = !isPast(toJSTDate(row.startDate))
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

  const addRowClassName = (params: GridRowClassNameParams<PatientRelateHealthFacilityModel>) => {
    // TODO 予定されてる場合や自分をハイライト
    return ''
  }

  return (
    <PaperBox title='施設変更履歴' icon={<HistoryOutlined />} sx={{ p: 0, mt: 1 }}>
      <div style={{ width: '100%', padding: '8px' }}>
        <div style={{ maxHeight: 200, width: '100%', overflowY: 'auto' }}>
          <DataGrid
            columnHeaderHeight={40}
            rows={records ?? []}
            columns={columns}
            hideFooter={true}
            disableColumnFilter={true}
            disableColumnSelector={true}
            disableVirtualization={true}
            disableDensitySelector={true}
            getRowClassName={addRowClassName}
          />
        </div>
      </div>
    </PaperBox>
  )
}
