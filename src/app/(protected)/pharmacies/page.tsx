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
import { EditButton, List, useDataGrid } from '@refinedev/mui'
import { useForm } from '@refinedev/react-hook-form'
import React from 'react'
import { QUERY_FORM_HINT } from '@/core/configs/constants'
import { FormSubmitErrorNotification, setTitle } from '@/core/utils/refineUtil'
import { uniqueId } from 'lodash'
import SearchIcon from '@mui/icons-material/Search'
import { zodResolver } from '@hookform/resolvers/zod'
import StickyTableContent from '@/components/core/grid/stickyTableContent'
import MuiLink from '@mui/material/Link'
import { PharmacyModel, PharmacyQueryForm, PharmacyQueryRequest, PharmacyQuerySchema } from '@/types'
import { ControlAutocomplete } from '@/components/core/form/controlAutocomplete'
import { RubyItem } from '@components/core/content/rubyItem'
import { formatDateTime } from '@/core/utils/dateUtil'

/**
 * 店舗一覧画面です。
 */
const ListPage: React.FC = () => {
  setTitle()
  const Link = useLink()
  const errorNotification = new FormSubmitErrorNotification()
  const { dataGridProps, filters, search } = useDataGrid<PharmacyModel, HttpError, PharmacyQueryRequest>({
    syncWithLocation: true,
    onSearch: (query) => {
      const { companyId, pharmacyGroupId, name } = query
      const filters: CrudFilters = []
      filters.push(
        { field: 'companyId', operator: 'eq', value: companyId },
        { field: 'pharmacyGroupId', operator: 'eq', value: pharmacyGroupId },
        { field: 'name', operator: 'eq', value: name },
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
  } = useForm<BaseRecord, HttpError, PharmacyQueryForm>({
    resolver: zodResolver(PharmacyQuerySchema),
    defaultValues: {
      companyId: getDefaultFilter('companyId', filters, 'eq'),
      pharmacyGroupId: getDefaultFilter('pharmacyGroupId', filters, 'eq'),
      name: getDefaultFilter('name', filters, 'eq'),
    },
  })
  errorNotification.error = setError

  const columns = React.useMemo<GridColDef<PharmacyModel>[]>(
    () => [
      {
        field: 'name',
        headerName: '店舗名',
        minWidth: 250,
        flex: 2,
        filterable: false,
        hideable: false,
        renderCell: function render({ row }) {
          return (
            <MuiLink component={Link} underline='none' to={`/pharmacies/show/${row.id}`}>
              {row.pharmacyGroup?.name + ' ' ?? ''}
              <RubyItem value={row.name} ruby={row.nameKana} />
            </MuiLink>
          )
        },
      },
      {
        field: 'updatedAt',
        flex: 1,
        headerName: '最終更新日時',
        filterable: false,
        renderCell: function render({ value }) {
          return formatDateTime(value)
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
        <Card>
          <CardHeader title='検索条件' sx={{ paddingTop: 1 }} />
          <CardContent>
            <Box
              component='form'
              sx={{ display: 'flex', flexDirection: 'column' }}
              autoComplete='off'
              onSubmit={handleSubmit(search)}
            >
              <ControlAutocomplete
                resource='companies'
                label='会社名'
                name='companyId'
                control={control}
                error={!!errors.companyId}
                helperText={errors.companyId?.message}
              />
              <ControlAutocomplete
                resource='pharmacyGroups'
                label='薬局名'
                name='pharmacyGroupId'
                control={control}
                error={!!errors.pharmacyGroupId}
                helperText={errors.pharmacyGroupId?.message}
              />
              <TextField
                {...register('name')}
                label='店舗名'
                placeholder='店舗名'
                error={!!errors.name}
                helperText={errors.name?.message || QUERY_FORM_HINT.CONTAIN}
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
