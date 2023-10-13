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
import { QueryFormErrorNotification, setTitle } from '@/core/utils/refineUtil'
import { uniqueId } from 'lodash'
import SearchIcon from '@mui/icons-material/Search'
import { zodResolver } from '@hookform/resolvers/zod'
import StickyTableContent from '@/components/core/grid/stickyTableContent'
import MuiLink from '@mui/material/Link'
import {
  HealthFacilityModel,
  HealthFacilityQueryForm,
  HealthFacilityQueryRequest,
  HealthFacilityQuerySchema,
} from '@/types'
import { ControlAutocomplete } from '@/components/core/form/controlAutocomplete'

/**
 * 施設一覧画面です。
 */
const ListPage: React.FC = () => {
  setTitle()
  const Link = useLink()
  const errorNotification = new QueryFormErrorNotification()
  const { dataGridProps, filters, search } = useDataGrid<HealthFacilityModel, HttpError, HealthFacilityQueryRequest>({
    syncWithLocation: true,
    onSearch: (query) => {
      const { code, searchName, pharmacyId } = query
      const filters: CrudFilters = []
      filters.push(
        { field: 'code', operator: 'eq', value: code },
        { field: 'searchName', operator: 'eq', value: searchName },
        { field: 'pharmacyId', operator: 'eq', value: pharmacyId },
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
  } = useForm<BaseRecord, HttpError, HealthFacilityQueryForm>({
    resolver: zodResolver(HealthFacilityQuerySchema),
    defaultValues: {
      code: getDefaultFilter('code', filters, 'eq'),
      searchName: getDefaultFilter('searchName', filters, 'eq'),
      pharmacyId: getDefaultFilter('pharmacyId', filters, 'eq'),
    },
  })
  errorNotification.error = setError

  const columns = React.useMemo<GridColDef<HealthFacilityModel>[]>(
    () => [
      {
        field: 'code',
        headerName: 'コード',
        flex: 1,
        filterable: false,
        hideable: false,
        renderCell: function render({ row }) {
          return row.code
        },
      },
      {
        field: 'name',
        headerName: '施設名',
        minWidth: 150,
        flex: 1,
        filterable: false,
        hideable: false,
        renderCell: function render({ row }) {
          return (
            <MuiLink component={Link} underline='none' to={`/healthFacilities/show/${row.id}`}>
              {row.name}
            </MuiLink>
          )
        },
      },
      {
        field: 'pharmacyName',
        flex: 1,
        headerName: '担当店舗',
        minWidth: 150,
        sortable: false,
        filterable: false,
        renderCell: function render({ row }) {
          return row.pharmacy?.pharmacyGroup?.name + ' ' + row.pharmacy?.name
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
        minWidth: 80,
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} lg={3}>
        <Card sx={{ paddingX: { xs: 2, md: 0 } }}>
          <CardHeader title='検索条件' />
          <CardContent sx={{ pt: 0 }}>
            <Box
              component='form'
              sx={{ display: 'flex', flexDirection: 'column' }}
              autoComplete='off'
              onSubmit={handleSubmit(search)}
            >
              <TextField
                {...register('code')}
                label='コード'
                placeholder='コード'
                error={!!errors.code}
                helperText={errors.code?.message || QUERY_FORM_HINT.MATCH}
              />
              <TextField
                {...register('searchName')}
                label='施設名'
                placeholder='施設名'
                error={!!errors.searchName}
                helperText={errors.searchName?.message || QUERY_FORM_HINT.CONTAIN}
              />
              <ControlAutocomplete
                resource='pharmacies'
                label='店舗名'
                name='pharmacyId'
                control={control}
                error={!!errors.pharmacyId}
                helperText={errors.pharmacyId?.message}
                optionLabel={(option: any) => {
                  return option?.pharmacyGroup?.name + ' ' + option?.name ?? ''
                }}
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
