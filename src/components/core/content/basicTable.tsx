import * as React from 'react'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import { Typography } from '@mui/material'
import Box from '@mui/material/Box'

/**
 * プロパティ型定義
 */
type Props = {
  /** タイトル */
  title?: string
  /** テーブルヘッダーデータ */
  tableHeadRow: string[]
  /** テーブルボディデータ */
  tableBodyRows: (string | JSX.Element)[][]
  /** 列の幅 */
  columnWidth?: number[]
  /** アイコンコンポーネント */
  icon?: any
  /** ハイライトする行 */
  highLightRows?: number[]
  /** フォントサイズ */
  fontSize?: number
  /** セルのパディング */
  padding?: string
  /** テーブルの最大の高さ */
  maxHeight?: number
}

/**
 * MUIのTableを利用したシンプルなテーブルコンポーネントです。
 * テーブルヘッダー、ボディの各データを配列で受け取り、テーブルを生成します。
 *
 * @param title タイトルテキスト
 * @param tableHeadRow テーブルヘッダーデータ
 * @param tableBodyRows テーブルボディデータ
 * @param columnWidth pxで各列の幅を指定し、テーブルの最小幅を調整。指定しない場合は自動調整
 * @param icon タイトル横のアイコン
 * @param highLightRows ハイライトする行
 * @param fontSize フォントサイズ
 * @param padding セルのパディング
 * @param maxHeight テーブルの最大の高さ
 */

export const BasicTable = (props: Props) => {
  const {
    title,
    tableHeadRow,
    tableBodyRows,
    columnWidth,
    icon,
    highLightRows,
    fontSize = 16,
    padding = '6px 16px',
    maxHeight = 400,
  } = props
  const minWidth = columnWidth ? columnWidth.reduce((a, b) => a + b) : 0

  return (
    <Paper>
      {title ? (
        <Typography sx={{ pt: 2, pl: 2, pb: 1 }} variant='h5' component='div'>
          {icon ? <Box sx={{ display: 'inline', verticalAlign: '-6px', mr: '12px' }}>{icon}</Box> : null}
          {title}
        </Typography>
      ) : null}
      <TableContainer style={{ maxHeight: maxHeight }}>
        <Table stickyHeader sx={{ minWidth: minWidth }}>
          <TableHead>
            <TableRow>
              {tableHeadRow.map((row, i) => (
                <TableCell
                  sx={{ fontSize: fontSize, padding: padding, textAlign: 'center' }}
                  key={i}
                  style={columnWidth ? { width: columnWidth[i] } : {}}
                >
                  {row}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {tableBodyRows.map((row, i: number) => (
              <TableRow
                key={i}
                sx={{
                  bgcolor: highLightRows && highLightRows.includes(i + 1) ? '#e7fad6' : '',
                  '&:last-child td, &:last-child th': { border: 0 },
                }}
              >
                {row.map((cell, j: number) => (
                  <TableCell sx={{ fontSize: fontSize, padding: padding }} key={j}>
                    {cell}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  )
}
