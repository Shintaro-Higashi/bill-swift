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
import {
  AccountManageModel,
  AccountManageQueryForm,
  AccountManageQueryRequest,
  AccountManageQuerySchema,
} from '@/types'
import { formatDateTime } from '@/core/utils/dateUtil'

/**
 * 口座管理一覧画面です。
 */
const ListPage: React.FC = () => {
  setTitle()
  const Link = useLink()
  const errorNotification = new FormSubmitErrorNotification()
  const { dataGridProps, filters, search } = useDataGrid<AccountManageModel, HttpError, AccountManageQueryRequest>({
    syncWithLocation: true,
    onSearch: (query) => {
      const { name } = query
      const filters: CrudFilters = []
      filters.push({ field: 'name', operator: 'eq', value: name }, { field: '_uid', operator: 'eq', value: uniqueId() })
      return filters
    },
    errorNotification: errorNotification.notification,
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<BaseRecord, HttpError, AccountManageQueryForm>({
    resolver: zodResolver(AccountManageQuerySchema),
    defaultValues: {
      name: getDefaultFilter('name', filters, 'eq'),
    },
  })
  errorNotification.error = setError

  const columns = React.useMemo<GridColDef<AccountManageModel>[]>(
    () => [
      {
        field: 'name',
        headerName: '口座管理名',
        minWidth: 200,
        flex: 2,
        filterable: false,
        hideable: false,
        renderCell: function render({ row }) {
          return (
            <MuiLink component={Link} underline='none' to={`/accountManages/show/${row.id}`}>
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
        maxWidth: 50,
      },
    ],
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
                {...register('name')}
                label='口座管理名'
                placeholder='みずほ'
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
