'use client'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { BaseRecord, CrudFilters, getDefaultFilter, HttpError, useLink } from '@refinedev/core'
import { DateField, EditButton, List, useDataGrid } from '@refinedev/mui'
import { useForm } from '@refinedev/react-hook-form'
import React from 'react'
import { DATE_FORMAT, QUERY_FORM_HINT } from '@/core/configs/constants'
import { FormSubmitErrorNotification, setTitle } from '@/core/utils/refineUtil'
import { uniqueId } from 'lodash'
import SearchIcon from '@mui/icons-material/Search'
import { zodResolver } from '@hookform/resolvers/zod'
import StickyTableContent from '@/components/core/grid/stickyTableContent'
import MuiLink from '@mui/material/Link'
import { PatientModel, PatientQueryRequest, PatientQuerySchema } from '@/types'
import { ControlAutocomplete } from '@/components/core/form/controlAutocomplete'
import { RubyItem } from '@components/core/content/rubyItem'
import { ControlSwitch } from '@components/core/form/controlSwitch'

/**
 * 患者一覧画面です。
 */
const ListPage: React.FC = () => {
  setTitle()
  const Link = useLink()
  const errorNotification = new FormSubmitErrorNotification()
  const { dataGridProps, filters, search } = useDataGrid<PatientModel, HttpError, PatientQueryRequest>({
    syncWithLocation: true,
    onSearch: (query) => {
      const { code, searchName, pharmacyId, healthFacilityId, billDisableFlag } = query
      const filters: CrudFilters = []
      filters.push(
        { field: 'code', operator: 'eq', value: code },
        { field: 'searchName', operator: 'eq', value: searchName },
        { field: 'pharmacyId', operator: 'eq', value: pharmacyId },
        { field: 'healthFacilityId', operator: 'eq', value: healthFacilityId },
        { field: 'billDisableFlag', operator: 'eq', value: billDisableFlag },
        { field: '_uid', operator: 'eq', value: uniqueId() },
      )
      return filters
    },
    errorNotification: errorNotification.notification,
  })

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setError,
  } = useForm<BaseRecord, HttpError, PatientQueryRequest>({
    resolver: zodResolver(PatientQuerySchema),
    defaultValues: {
      code: getDefaultFilter('code', filters, 'eq'),
      searchName: getDefaultFilter('searchName', filters, 'eq'),
      pharmacyId: getDefaultFilter('pharmacyId', filters, 'eq'),
      healthFacilityId: getDefaultFilter('healthFacilityId', filters, 'eq'),
      billDisableFlag: getDefaultFilter('billDisableFlag', filters, 'eq'),
    },
  })
  errorNotification.error = setError

  const columns = React.useMemo<GridColDef<PatientModel>[]>(
    () => [
      {
        field: 'name',
        headerName: '氏名',
        flex: 1,
        filterable: false,
        hideable: false,
        renderCell: function render({ row }) {
          return (
            <MuiLink component={Link} underline='none' to={`/patients/show/${row.id}`}>
              <RubyItem value={row?.name} ruby={row?.nameKana} />
            </MuiLink>
          )
        },
      },
      {
        field: 'code',
        headerName: '患者番号',

        filterable: false,
        hideable: false,
        width: 95,
      },
      {
        field: 'healthFacility.name',
        headerName: '所属施設',
        flex: 1,
        filterable: false,
        hideable: false,
        renderCell: function render({ row }) {
          return <RubyItem value={row?.healthFacility?.name} ruby={row?.healthFacility?.nameKana} />
        },
      },
      {
        field: 'updatedAt',
        flex: 1,
        headerName: '最終更新日時',
        filterable: false,
        renderCell: function render({ value }) {
          return <DateField value={value} format={DATE_FORMAT} />
        },
      },
      {
        field: 'updatedBy',
        flex: 1,
        headerName: '最終更新者',
        sortable: false,
        filterable: false,
        renderCell: function render({ row }) {
          return row.updatedUser?.name
        },
      },
      {
        field: 'actions',
        headerName: '操作',
        sortable: false,
        filterable: false,
        hideable: false,
        renderCell: function render({ row }) {
          return (
            <>
              <EditButton hideText recordItemId={row.id} />
            </>
          )
        },
        align: 'center',
        headerAlign: 'center',
        maxWidth: 50,
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} lg={3}>
        <Card>
          <CardHeader title='検索条件' sx={{ paddingTop: 1 }} />
          <CardContent>
            <Box
              component='form'
              sx={{ display: 'flex', flexDirection: 'column' }}
              autoComplete='off'
              onSubmit={handleSubmit(search)}
            >
              <TextField
                {...register('searchName')}
                label='氏名'
                error={!!errors.searchName}
                helperText={errors.searchName?.message || QUERY_FORM_HINT.SEARCH_NAME}
              />
              <TextField
                {...register('code')}
                label='患者番号'
                error={!!errors.code}
                helperText={errors.code?.message || QUERY_FORM_HINT.MATCH}
              />

              <ControlAutocomplete
                resource='pharmacies'
                label='担当店舗'
                name='pharmacyId'
                control={control}
                error={!!errors.pharmacyId}
                helperText={errors.pharmacyId?.message || '※過去の店舗も対象'}
              />
              <ControlAutocomplete
                resource='healthFacilities'
                label='所属施設'
                name='healthFacilityId'
                control={control}
                error={!!errors.healthFacilityId}
                helperText={errors.healthFacilityId?.message || '※過去の施設も対象'}
              />
              <ControlSwitch
                control={control}
                name='billDisableFlag'
                label='請求不可の患者のみに絞り込む'
                error={!!errors.billDisableFlag}
                helperText={errors.billDisableFlag?.message}
              />
              <Button type='submit' variant='contained' startIcon={<SearchIcon />}>
                検索
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} lg={9}>
        <List wrapperProps={{ sx: { paddingX: { xs: 2, md: 0 } } }}>
          <StickyTableContent>
            <DataGrid {...dataGridProps} columns={columns} filterModel={undefined} />
          </StickyTableContent>
        </List>
      </Grid>
    </Grid>
  )
}
export default ListPage
