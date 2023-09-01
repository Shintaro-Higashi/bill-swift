'use client'

import { IPost } from '@/types'
import StickyTableContent from '@components/core/grid/stickyTableContent'
import CustomPagination from '@components/core/pagination/customPagination'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { useMany } from '@refinedev/core'
import { DateField, DeleteButton, EditButton, List, MarkdownField, ShowButton, useDataGrid } from '@refinedev/mui'
import React from 'react'

const BlogPostList: React.FC = () => {
  const { dataGridProps } = useDataGrid<IPost>({
    dataProviderName: 'fake',
    initialCurrent: 1,
    // initialPageSize: 10,
    // pagination: {  paginationModel: {pageSize: 25}},
    initialSorter: [
      {
        field: 'title',
        order: 'asc',
      },
    ],
    initialFilter: [
      {
        field: 'status',
        operator: 'eq',
        value: 'draft',
      },
    ],
    syncWithLocation: true,
  })

  const { data: categoryData, isLoading: categoryIsLoading } = useMany({
    dataProviderName: 'fake',
    resource: 'categories',
    ids: dataGridProps?.rows?.map((item: any) => item?.category?.id) ?? [],
    queryOptions: {
      enabled: !!dataGridProps?.rows,
    },
  })

  const columns = React.useMemo<GridColDef<IPost>[]>(
    () => [
      {
        field: 'id',
        headerName: 'ID',
        type: 'number',
        minWidth: 55,
        maxWidth: 75,
      },
      {
        field: 'title',
        flex: 1,
        headerName: 'タイトル',
        minWidth: 200,
      },
      {
        field: 'content',
        flex: 1,
        headerName: '内容',
        minWidth: 250,
        renderCell: function render({ value }) {
          return <MarkdownField value={(value ?? '').slice(0, 80) + '...'} />
        },
      },
      {
        field: 'category',
        flex: 1,
        headerName: 'カテゴリ',
        valueGetter: ({ row }) => {
          return row?.category?.id
        },
        minWidth: 300,
        renderCell: function render({ value }) {
          return categoryIsLoading ? <>Loading...</> : categoryData?.data?.find((item) => item.id === value)?.title
        },
      },
      {
        field: 'status',
        flex: 1,
        headerName: 'ステータス',
        minWidth: 200,
      },
      {
        field: 'createdAt',
        flex: 1,
        headerName: '作成日時',
        minWidth: 250,
        renderCell: function render({ value }) {
          return <DateField value={value} />
        },
      },
      {
        field: 'actions',
        headerName: '操作',
        sortable: false,
        renderCell: function render({ row }) {
          return (
            <>
              <EditButton hideText recordItemId={row.id} />
              <ShowButton hideText recordItemId={row.id} />
              <DeleteButton hideText recordItemId={row.id} />
            </>
          )
        },
        align: 'center',
        headerAlign: 'center',
        minWidth: 80,
      },
    ],
    [categoryData?.data, categoryIsLoading],
  )

  return (
    <List>
      <StickyTableContent>
        <DataGrid {...dataGridProps} columns={columns} disableColumnFilter={true} />
      </StickyTableContent>
    </List>
  )
}
export default BlogPostList
