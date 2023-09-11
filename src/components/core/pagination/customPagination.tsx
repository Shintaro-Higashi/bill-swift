import MuiPagination from '@mui/material/Pagination'
import { TablePaginationProps } from '@mui/material/TablePagination'
import {
  gridFilteredTopLevelRowCountSelector,
  gridPageSizeSelector,
  GridPagination,
  useGridApiContext,
  useGridRootProps,
  useGridSelector,
} from '@mui/x-data-grid'
import React from 'react'

/**
 * muiのx-data-girdのpaginationのカスタマイズコンポーネントです。
 * <pre>
 *  デフォルトUIでは現在ページの前後しか遷移できないため一般的な前後数ページへ遷移可能なUIを提供するための
 *  カスタムコンポーネントです。
 *  ※ server mode 前提です。
 *  参考issue: https://github.com/mui/mui-x/issues/8450
 * </pre>
 * @param props
 * @constructor
 */
const CustomPagination: React.FC = (props: any) => {
  return <GridPagination ActionsComponent={Pagination} {...props} />
}
export default CustomPagination

const getPageCount = (rowCount: number, pageSize: number): number => {
  if (pageSize > 0 && rowCount > 0) {
    return Math.ceil(rowCount / pageSize)
  }
  return 0
}

function Pagination({
  page,
  onPageChange,
  className,
}: Pick<TablePaginationProps, 'page' | 'onPageChange' | 'className'>) {
  const apiRef = useGridApiContext()
  const pageSize = useGridSelector(apiRef, gridPageSizeSelector)
  const visibleTopLevelRowCount = useGridSelector(apiRef, gridFilteredTopLevelRowCountSelector)
  const rootProps = useGridRootProps()
  const pageCount = getPageCount(rootProps.rowCount ?? visibleTopLevelRowCount, pageSize)

  return (
    <MuiPagination
      color='primary'
      className={className}
      count={pageCount}
      page={page + 1}
      onChange={(event, newPage) => {
        onPageChange(event as any, newPage - 1)
      }}
    />
  )
}
