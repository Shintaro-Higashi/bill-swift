'use client'

import { CompanyQuery, CompanyQuerySchema } from '@/types/companies'
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
import { CompanyModel } from '@/types/models/companyModel'

/**
 * 会社一覧画面です。
 */
const ListPage: React.FC = () => {
  setTitle()
  const Link = useLink()
  const errorNotification = new QueryFormErrorNotification()
  const { dataGridProps, filters, search } = useDataGrid<CompanyModel, HttpError, CompanyQuery>({
    syncWithLocation: true,
    onSearch: (query) => {
      const { id, name } = query
      // Point: operator値に応じてフィールド名が可変になるので全てeqで統一がよさそう(汎用的なoperatorは対応しないため)
      const filters: CrudFilters = []
      filters.push(
        { field: 'id', operator: 'eq', value: id },
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
    formState: { errors },
    setError,
  } = useForm<BaseRecord, HttpError, CompanyQuery>({
    resolver: zodResolver(CompanyQuerySchema),
    defaultValues: {
      id: getDefaultFilter('id', filters, 'eq'),
      name: getDefaultFilter('name', filters, 'eq'),
    },
  })
  // Point: useDataGridのfiltersをuseFormでは必要としuseFormのsetErrorをuseDataGridは必要とする矛盾構成を回避するため苦肉の実装方法を取っている
  errorNotification.error = setError

  const columns = React.useMemo<GridColDef<CompanyModel>[]>(
    () => [
      {
        field: 'name',
        headerName: '会社名',
        minWidth: 200,
        flex: 1,
        filterable: false,
        hideable: false,
        renderCell: function render({ row }) {
          return (
            <MuiLink component={Link} underline='none' to={`/companies/show/${row.id}`}>
              {row.name}
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
          return row.userCompanyCreatedByTouser?.name
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
                {...register('id')}
                label='ID'
                placeholder='ID'
                error={!!errors.id}
                helperText={errors.id?.message || QUERY_FORM_HINT.MATCH}
              />
              <TextField
                {...register('name')}
                label='会社名'
                placeholder='XX株式会社'
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
