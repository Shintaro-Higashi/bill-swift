'use client'

/**
 * 患者情報変更履歴を表示するコンポーネント定義です。
 * <pre>
 * </pre>
 */
import React, { Fragment } from 'react'
import { PatientRelateHealthFacilityModel } from '@/types'
import { Box } from '@mui/material'
import { HttpError, useCustom } from '@refinedev/core'
import { Loading } from '@components/core/content/loading'
import { formatDate, formatDateTime } from '@/core/utils/dateUtil'
import { HistoryOutlined } from '@mui/icons-material'
import { PaperBox } from '@components/core/content/paperBox'
import { DataGrid, GridColDef } from '@mui/x-data-grid'

import { RubyItem } from '@components/core/content/rubyItem'
import { getPatientHealthFacilityChangeReasonValue } from '@/shared/items/patientHealthFacilityChangeReason'
import { RenderCellExpand } from '@components/core/grid/renderCellExpand'

type Props = {
  // 変更履歴取得対象の患者ID
  patientId: string
  // 該当患者IDの最終更新日時(変更が発生したら履歴の再取得を行う判定に利用)
  updatedAt: Date | null | undefined
}

/**
 * 患者の所属施設履歴情報を表示します。
 */
export const PatientHealthFacility = (props: Props) => {
  const { patientId } = props

  const { data, isLoading, isError } = useCustom<PatientRelateHealthFacilityModel[], HttpError>({
    method: 'get',
    url: `/api/patients/${patientId}/health-facilities`,
    config: {
      query: { uid: props.updatedAt },
    },
  })

  const records = data?.data
  if (!records) {
    return <Loading />
  }

  // const columns = React.useMemo<GridColDef<PatientRelateHealthFacilityModel>[]>(
  //   () => [
  //     {
  //       field: 'pharmacy',
  //       headerName: '店舗',
  //       sortable: false,
  //       renderCell: ({ row }) => {
  //         return (
  //           <>
  //             ${row.healthFacility?.pharmacy?.pharmacyGroup?.name}&nbsp;${row.healthFacility?.pharmacy?.name}
  //           </>
  //         )
  //       },
  //     },
  //     {
  //       field: 'healthFacility',
  //       headerName: '施設',
  //       sortable: false,
  //       renderCell: ({ row }) => {
  //         return <RubyItem value={row.healthFacility.name} ruby={row.healthFacility.nameKana} />
  //       },
  //     },
  //     { field: 'patientCode', headerName: '患者コード', sortable: false },
  //     {
  //       field: 'reason',
  //       headerName: '理由',
  //       sortable: false,
  //       renderCell: ({ row }) => {
  //         return <>${getPatientHealthFacilityChangeReasonValue(row?.reason)}</>
  //       },
  //     },
  //   ],
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  //   [],
  // )
  const columns: GridColDef<PatientRelateHealthFacilityModel>[] = [
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
  ]

  return (
    <PaperBox title='施設変更履歴' icon={<HistoryOutlined />} sx={{ p: 0, mt: 2 }}>
      <div style={{ width: '100%' }}>
        <div style={{ maxHeight: 300, width: '100%', overflowY: 'auto' }}>
          <DataGrid
            columnHeaderHeight={40}
            rows={records}
            columns={columns}
            hideFooter={true}
            disableColumnFilter={true}
            disableColumnSelector={true}
            disableVirtualization={true}
            disableDensitySelector={true}
          />
        </div>
      </div>
    </PaperBox>
  )
}
